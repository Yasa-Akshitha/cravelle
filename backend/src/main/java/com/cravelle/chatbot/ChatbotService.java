package com.cravelle.chatbot;

import com.cravelle.dto.*;
import com.cravelle.entity.*;
import com.cravelle.exception.BadRequestException;
import com.cravelle.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class ChatbotService {

    private static final Logger logger = LoggerFactory.getLogger(ChatbotService.class);

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final ChatConversationRepository chatConversationRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final StorePolicyService storePolicyService;
    private final LlmClient llmClient;

    public ChatbotService(
            ProductRepository productRepository,
            OrderRepository orderRepository,
            ChatConversationRepository chatConversationRepository,
            ChatMessageRepository chatMessageRepository,
            UserRepository userRepository,
            StorePolicyService storePolicyService,
            LlmClient llmClient) {
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.chatConversationRepository = chatConversationRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.userRepository = userRepository;
        this.storePolicyService = storePolicyService;
        this.llmClient = llmClient;
    }

    @Transactional
    public ChatResponseDTO processChat(Long userId, ChatRequest request) {
        String userQuery = request.getMessage().trim();

        // 1. Resolve or create conversation
        ChatConversation conversation = resolveConversation(userId, request);

        // 2. Query matching products from MySQL
        List<Product> catalogCandidates = findMatchingProducts(userQuery);

        // 3. User order context if authenticated and relevant
        String orderContext = "";
        if (userId != null && (userQuery.toLowerCase().contains("order") || userQuery.toLowerCase().contains("track"))) {
            List<Order> userOrders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
            if (!userOrders.isEmpty()) {
                Order latest = userOrders.get(0);
                orderContext = String.format(
                        "The user has a recent Order #%d placed on %s with status: %s, total: ₹%.2f, payment: %s.",
                        latest.getId(), latest.getCreatedAt().toLocalDate(), latest.getOrderStatus(), latest.getTotal(), latest.getPaymentStatus()
                );
            } else {
                orderContext = "The user has no previous orders.";
            }
        }

        // 4. Retrieve recent message history
        List<ChatMessage> history = chatMessageRepository.findByConversationIdOrderByCreatedAtAsc(conversation.getId());
        List<Map<String, String>> historyPayload = new ArrayList<>();
        // Keep last 6 messages
        int startIdx = Math.max(0, history.size() - 6);
        for (int i = startIdx; i < history.size(); i++) {
            ChatMessage m = history.get(i);
            Map<String, String> item = new HashMap<>();
            item.put("role", m.getRole().equalsIgnoreCase("USER") ? "user" : "assistant");
            item.put("content", m.getMessage());
            historyPayload.add(item);
        }

        // 5. Construct System Prompt with Ground Truth
        StringBuilder catalogContextBuilder = new StringBuilder();
        for (Product p : catalogCandidates) {
            catalogContextBuilder.append(String.format(
                    "- [ID: %d] %s: ₹%s (Category: %s). Description: %s\n",
                    p.getId(), p.getName(), p.getPrice(),
                    p.getCategory() != null ? p.getCategory().getName() : "Fashion",
                    p.getDescription()
            ));
        }

        String systemPrompt = String.format("""
            You are Cravelle AI, a sophisticated, warm, and knowledgeable luxury fashion personal stylist for the Cravelle fashion boutique.
            
            STORE POLICIES:
            %s
            
            VERIFIED REAL CATALOG ITEMS AVAILABLE IN STORE:
            %s
            
            AUTHENTICATED USER ORDER INFORMATION:
            %s
            
            GUIDELINES:
            1. Provide elegant, stylish styling advice, outfit recommendations, and pairing tips.
            2. When recommending products, ONLY recommend items from the VERIFIED REAL CATALOG ITEMS listed above. Mention their exact names and product IDs like [ID: X].
            3. NEVER invent or hallucinate product IDs, prices, discounts, stock, or order status that are not provided in this context.
            4. Keep answers chic, helpful, and concise (2-4 paragraphs maximum).
            """,
                storePolicyService.getStorePoliciesSummary(),
                catalogContextBuilder.toString(),
                orderContext
        );

        // 6. Generate AI completion or intelligent catalog synthesis
        String assistantReply = llmClient.generateCompletion(systemPrompt, historyPayload, userQuery);

        if (assistantReply == null || assistantReply.isBlank()) {
            assistantReply = fallbackStylistReply(userQuery, catalogCandidates, orderContext);
        }

        // 7. Extract & validate recommended product cards against real database records
        List<ProductRecommendationCardDTO> recommendedCards = extractAndValidateCards(assistantReply, catalogCandidates);

        // If no cards were extracted via regex but catalog matches exist for a shopping/recommendation query, add top matches
        if (recommendedCards.isEmpty() && !catalogCandidates.isEmpty() && isRecommendationIntent(userQuery)) {
            for (int i = 0; i < Math.min(3, catalogCandidates.size()); i++) {
                Product p = catalogCandidates.get(i);
                recommendedCards.add(new ProductRecommendationCardDTO(
                        p.getId(),
                        p.getName(),
                        p.getSlug(),
                        p.getPrice(),
                        p.getOriginalPrice(),
                        p.getImageUrl(),
                        p.getCategory() != null ? p.getCategory().getName() : "Fashion",
                        "Curated by Cravelle Stylist"
                ));
            }
        }

        // 8. Persist messages in database
        chatMessageRepository.save(new ChatMessage(conversation, "USER", userQuery));
        chatMessageRepository.save(new ChatMessage(conversation, "ASSISTANT", assistantReply));

        // 9. Suggested questions
        List<String> suggestedQuestions = Arrays.asList(
                "Show me evening dresses",
                "Recommend an outfit under ₹3,000",
                "What is your return & exchange policy?",
                "How do I style a silk blouse for a cocktail party?"
        );

        return new ChatResponseDTO(conversation.getId(), assistantReply, recommendedCards, suggestedQuestions);
    }

    @Transactional(readOnly = true)
    public ChatHistoryResponseDTO getHistory(Long userId, String guestSessionId) {
        Optional<ChatConversation> convOpt = Optional.empty();
        if (userId != null) {
            convOpt = chatConversationRepository.findTopByUserIdOrderByUpdatedAtDesc(userId);
        } else if (guestSessionId != null && !guestSessionId.isBlank()) {
            convOpt = chatConversationRepository.findTopByGuestSessionIdOrderByUpdatedAtDesc(guestSessionId);
        }

        if (convOpt.isEmpty()) {
            return new ChatHistoryResponseDTO(null, Collections.emptyList());
        }

        ChatConversation conv = convOpt.get();
        List<ChatMessageDTO> messageDTOs = chatMessageRepository.findByConversationIdOrderByCreatedAtAsc(conv.getId())
                .stream()
                .map(m -> new ChatMessageDTO(m.getId(), m.getRole(), m.getMessage(), m.getCreatedAt()))
                .collect(Collectors.toList());

        return new ChatHistoryResponseDTO(conv.getId(), messageDTOs);
    }

    @Transactional
    public void clearHistory(Long userId, String guestSessionId) {
        if (userId != null) {
            chatConversationRepository.deleteByUserId(userId);
        } else if (guestSessionId != null && !guestSessionId.isBlank()) {
            chatConversationRepository.deleteByGuestSessionId(guestSessionId);
        }
    }

    private ChatConversation resolveConversation(Long userId, ChatRequest request) {
        if (userId != null) {
            User user = userRepository.findById(userId).orElse(null);
            return chatConversationRepository.findTopByUserIdOrderByUpdatedAtDesc(userId)
                    .orElseGet(() -> chatConversationRepository.save(new ChatConversation(user, null)));
        }

        String guestSessionId = request.getGuestSessionId();
        if (guestSessionId == null || guestSessionId.isBlank()) {
            guestSessionId = UUID.randomUUID().toString();
        }

        final String finalGuestSessionId = guestSessionId;
        return chatConversationRepository.findTopByGuestSessionIdOrderByUpdatedAtDesc(finalGuestSessionId)
                .orElseGet(() -> chatConversationRepository.save(new ChatConversation(null, finalGuestSessionId)));
    }

    private List<Product> findMatchingProducts(String query) {
        String lower = query.toLowerCase();

        // Check for budget mentions (e.g., "under 2000", "under ₹1500")
        Pattern pricePattern = Pattern.compile("(?:under|below|less than|within)\\s*(?:₹|rs\\.?|inr)?\\s*(\\d+)");
        Matcher priceMatcher = pricePattern.matcher(lower);
        BigDecimal maxBudget = null;
        if (priceMatcher.find()) {
            try {
                maxBudget = new BigDecimal(priceMatcher.group(1));
            } catch (Exception ignored) {}
        }

        // Search in product catalog
        List<Product> products = productRepository.findAll();
        List<Product> filtered = new ArrayList<>();

        for (Product p : products) {
            if (p.getStatus() != ProductStatus.ACTIVE) continue;

            if (maxBudget != null && p.getPrice().compareTo(maxBudget) > 0) {
                continue;
            }

            boolean matches = lower.contains("dress") && p.getName().toLowerCase().contains("dress")
                    || lower.contains("blazer") && p.getName().toLowerCase().contains("blazer")
                    || lower.contains("blouse") && p.getName().toLowerCase().contains("blouse")
                    || lower.contains("trouser") && p.getName().toLowerCase().contains("trouser")
                    || lower.contains("bag") && p.getName().toLowerCase().contains("tote")
                    || lower.contains("gold") && p.getName().toLowerCase().contains("gold")
                    || lower.contains("silk") && p.getName().toLowerCase().contains("silk")
                    || lower.contains("skirt") && p.getName().toLowerCase().contains("skirt")
                    || lower.contains(p.getName().toLowerCase().split(" ")[0]);

            if (matches || maxBudget != null) {
                filtered.add(p);
            }
        }

        if (filtered.isEmpty()) {
            // Return top active products if no specific match
            return productRepository.findTop8ByStatusOrderByCreatedAtDesc(ProductStatus.ACTIVE);
        }

        return filtered;
    }

    private List<ProductRecommendationCardDTO> extractAndValidateCards(String reply, List<Product> catalogCandidates) {
        List<ProductRecommendationCardDTO> cards = new ArrayList<>();
        Set<Long> addedIds = new HashSet<>();

        // Match "[ID: 1]" or "ID: 1"
        Pattern pattern = Pattern.compile("ID:\\s*(\\d+)");
        Matcher matcher = pattern.matcher(reply);

        while (matcher.find()) {
            try {
                Long id = Long.parseLong(matcher.group(1));
                if (!addedIds.contains(id)) {
                    // Validate ID strictly against active database products
                    productRepository.findById(id).filter(p -> p.getStatus() == ProductStatus.ACTIVE).ifPresent(p -> {
                        addedIds.add(p.getId());
                        cards.add(new ProductRecommendationCardDTO(
                                p.getId(),
                                p.getName(),
                                p.getSlug(),
                                p.getPrice(),
                                p.getOriginalPrice(),
                                p.getImageUrl(),
                                p.getCategory() != null ? p.getCategory().getName() : "Fashion",
                                "Recommended for your style inquiry"
                        ));
                    });
                }
            } catch (Exception ignored) {}
        }

        return cards;
    }

    private boolean isRecommendationIntent(String query) {
        String lower = query.toLowerCase();
        return lower.contains("recommend") || lower.contains("show") || lower.contains("find")
                || lower.contains("outfit") || lower.contains("dress") || lower.contains("blazer")
                || lower.contains("under") || lower.contains("party") || lower.contains("college")
                || lower.contains("event") || lower.contains("wear");
    }

    private String fallbackStylistReply(String query, List<Product> catalogCandidates, String orderContext) {
        String lower = query.toLowerCase();

        if (lower.contains("policy") || lower.contains("shipping") || lower.contains("return")) {
            return "At Cravelle, we offer complimentary shipping on all orders over ₹3,000 (standard express delivery is ₹150 for orders below). We also pride ourselves on a seamless 14-day return and exchange policy for unworn pieces with tags intact. If you require assistance with an existing order, feel free to reach out to support@cravelle.com.";
        }

        if (!orderContext.isBlank() && (lower.contains("order") || lower.contains("track"))) {
            return "Here is the status of your order: " + orderContext + ". If you have questions about shipment milestones, our support concierge is at your service.";
        }

        StringBuilder reply = new StringBuilder();
        reply.append("Welcome to Cravelle. Based on your style preferences, I have curated these bespoke pieces from our atelier:\n\n");

        int count = 0;
        for (Product p : catalogCandidates) {
            reply.append(String.format("• **%s** [ID: %d] — ₹%s. Beautifully crafted with fine fabrics.\n",
                    p.getName(), p.getId(), p.getPrice()));
            if (++count >= 3) break;
        }

        reply.append("\nPair these with delicate accessories for a polished and effortless look. Let me know if you would like styling tips for a specific occasion or color palette!");
        return reply.toString();
    }
}
