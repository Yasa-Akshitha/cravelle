package com.cravelle.chatbot;

import com.cravelle.dto.ChatRequest;
import com.cravelle.dto.ChatResponseDTO;
import com.cravelle.dto.DishRecommendationCardDTO;
import com.cravelle.entity.*;
import com.cravelle.recommendation.HaversineDistanceCalculator;
import com.cravelle.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class ChatbotService {

    private static final Logger logger = LoggerFactory.getLogger(ChatbotService.class);

    private final LlmClient llmClient;
    private final RestaurantRepository restaurantRepository;
    private final DishRepository dishRepository;
    private final SavedPlaceRepository savedPlaceRepository;
    private final UserPreferenceRepository userPreferenceRepository;
    private final OrderRepository orderRepository;
    private final ChatConversationRepository conversationRepository;
    private final ChatMessageRepository messageRepository;
    private final ObjectMapper objectMapper;

    public ChatbotService(LlmClient llmClient,
                          RestaurantRepository restaurantRepository,
                          DishRepository dishRepository,
                          SavedPlaceRepository savedPlaceRepository,
                          UserPreferenceRepository userPreferenceRepository,
                          OrderRepository orderRepository,
                          ChatConversationRepository conversationRepository,
                          ChatMessageRepository messageRepository,
                          ObjectMapper objectMapper) {
        this.llmClient = llmClient;
        this.restaurantRepository = restaurantRepository;
        this.dishRepository = dishRepository;
        this.savedPlaceRepository = savedPlaceRepository;
        this.userPreferenceRepository = userPreferenceRepository;
        this.orderRepository = orderRepository;
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.objectMapper = objectMapper;
    }

    public ChatResponseDTO processChat(ChatRequest request, User user) {
        String userQuery = request.getMessage() != null ? request.getMessage().trim() : "";
        Double userLat = request.getLatitude() != null ? request.getLatitude() : 12.9716;
        Double userLng = request.getLongitude() != null ? request.getLongitude() : 77.5946;
        BigDecimal userBudget = request.getBudget();

        // 1. Manage Conversation
        ChatConversation conversation = getOrCreateConversation(request.getConversationId(), user, request.getGuestSessionId());

        // 2. Fetch User Context
        UserPreference preference = null;
        List<SavedPlace> savedPlaces = new ArrayList<>();
        List<Order> previousOrders = new ArrayList<>();
        if (user != null) {
            preference = userPreferenceRepository.findByUserId(user.getId()).orElse(null);
            savedPlaces = savedPlaceRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
            previousOrders = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        }

        boolean pureVegOnly = preference != null && Boolean.TRUE.equals(preference.getIsPureVeg());

        // 3. Retrieve Verified Restaurant and Dish Catalog
        List<Restaurant> allRestaurants = restaurantRepository.findAll();
        List<Dish> allDishes = dishRepository.findAll();

        // 4. Grounded Matching Algorithm
        List<DishRecommendationCardDTO> recommendedCards = findMatchingDishes(userQuery, userLat, userLng, userBudget, pureVegOnly, savedPlaces, previousOrders, allRestaurants, allDishes);

        // 5. Generate Response (via LLM or Intelligent Fallback Synthesizer)
        String aiReply;
        if (llmClient.isConfigured()) {
            aiReply = generateLlmReply(userQuery, recommendedCards, savedPlaces, preference);
        } else {
            aiReply = synthesizeFallbackReply(userQuery, recommendedCards, savedPlaces, preference);
        }

        // 6. Save message history
        saveMessages(conversation, userQuery, aiReply, recommendedCards);

        // 7. Dynamic Prompt Pills
        List<String> suggestedQuestions = List.of(
                "Find good biryani near my current location",
                "Suggest quick lunch under ₹200",
                "What food can I try near my saved college?",
                "Show healthy vegetarian bowls",
                "What are your top artisanal desserts?"
        );

        return new ChatResponseDTO(conversation.getId(), aiReply, recommendedCards, suggestedQuestions);
    }

    private List<DishRecommendationCardDTO> findMatchingDishes(String query, Double userLat, Double userLng, BigDecimal budget,
                                                               boolean pureVegOnly, List<SavedPlace> savedPlaces,
                                                               List<Order> previousOrders,
                                                               List<Restaurant> restaurants, List<Dish> dishes) {
        String qLower = query.toLowerCase();
        List<DishRecommendationCardDTO> matches = new ArrayList<>();

        // Detect keywords
        boolean wantsBiryani = qLower.contains("biryani") || qLower.contains("rice");
        boolean wantsVeg = qLower.contains("veg") || pureVegOnly;
        boolean wantsCafeOrDessert = qLower.contains("cafe") || qLower.contains("coffee") || qLower.contains("dessert") || qLower.contains("sweet");
        boolean wantsBudget = qLower.contains("under") || qLower.contains("cheap") || qLower.contains("budget") || qLower.contains("affordable") || budget != null;
        boolean wantsCollege = qLower.contains("college") || qLower.contains("campus") || qLower.contains("student") || qLower.contains("pes");
        boolean wantsOffice = qLower.contains("office") || qLower.contains("work") || qLower.contains("prestige");
        boolean wantsMall = qLower.contains("mall") || qLower.contains("shopping") || qLower.contains("phoenix");
        boolean wantsHistory = qLower.contains("previous") || qLower.contains("last order") || qLower.contains("reorder");

        BigDecimal maxPrice = budget != null ? budget : (wantsBudget ? BigDecimal.valueOf(250.00) : BigDecimal.valueOf(550.00));

        // Prioritize matching dishes
        for (Dish dish : dishes) {
            if (!Boolean.TRUE.equals(dish.getIsAvailable())) continue;
            if (wantsVeg && !Boolean.TRUE.equals(dish.getIsVeg())) continue;
            if (dish.getPrice().compareTo(maxPrice) > 0) continue;

            Restaurant rest = dish.getRestaurant();
            if (rest == null || !Boolean.TRUE.equals(rest.getIsOpen())) continue;

            double dist = HaversineDistanceCalculator.calculateDistanceKm(userLat, userLng, rest.getLatitude(), rest.getLongitude());
            String rationale = "Curated for your palate";

            boolean isMatch = false;

            if (wantsCollege && (rest.getName().toLowerCase().contains("arogya") || rest.getAddress().toLowerCase().contains("bsk") || rest.getAddress().toLowerCase().contains("pes"))) {
                isMatch = true;
                rationale = "Popular student favorite near PES University Campus";
            } else if (wantsOffice && (rest.getName().toLowerCase().contains("bao") || rest.getName().toLowerCase().contains("green bowl") || rest.getAddress().toLowerCase().contains("marathahalli"))) {
                isMatch = true;
                rationale = "Rapid express lunch serving tech teams near Prestige Tech Park";
            } else if (wantsMall && (rest.getName().toLowerCase().contains("lamour") || rest.getName().toLowerCase().contains("toscano"))) {
                isMatch = true;
                rationale = "Artisanal dining & pastries around Phoenix Marketcity";
            } else if (wantsBiryani && dish.getName().toLowerCase().contains("biryani")) {
                isMatch = true;
                rationale = "Top-rated authentic dum biryani made with fragrant spices";
            } else if (wantsCafeOrDessert && (dish.getName().toLowerCase().contains("tart") || dish.getName().toLowerCase().contains("latte") || dish.getName().toLowerCase().contains("kaapi"))) {
                isMatch = true;
                rationale = "Specialty roast & artisanal sweet indulgence";
            } else if (wantsHistory && !previousOrders.isEmpty()) {
                isMatch = true;
                rationale = "Similar to your highly-rated previous orders";
            } else if (qLower.isEmpty() || dish.getName().toLowerCase().contains(qLower) || rest.getName().toLowerCase().contains(qLower)) {
                isMatch = true;
                rationale = "Matches your current search query";
            } else if (matches.size() < 4) {
                // General high quality fallback
                isMatch = true;
                rationale = "Highly recommended by Cravelle food community";
            }

            if (isMatch) {
                matches.add(new DishRecommendationCardDTO(
                        dish.getId(),
                        dish.getName(),
                        rest.getId(),
                        rest.getName(),
                        dish.getPrice(),
                        dish.getImageUrl(),
                        dish.getIsVeg(),
                        Math.round(dist * 10.0) / 10.0,
                        dish.getRating(),
                        rest.getDeliveryTimeMinutes(),
                        rationale
                ));
            }

            if (matches.size() >= 4) break;
        }

        return matches;
    }

    private String generateLlmReply(String query, List<DishRecommendationCardDTO> cards, List<SavedPlace> savedPlaces, UserPreference pref) {
        StringBuilder catalogContext = new StringBuilder();
        catalogContext.append("Verified dishes available for this request:\n");
        for (DishRecommendationCardDTO c : cards) {
            catalogContext.append(String.format("- %s from %s (Price: ₹%s, Veg: %s, Distance: %s km, Rating: %s)\n",
                    c.getName(), c.getRestaurantName(), c.getPrice(), c.getIsVeg(), c.getDistanceKm(), c.getRating()));
        }

        String sysPrompt = "You are Cravelle AI, a passionate, food concierge for Cravelle food discovery & delivery. " +
                "Help the user discover delicious meals grounded strictly in the provided verified restaurant catalog. " +
                "Never invent dishes or prices not in the list. Provide appetizing, warm descriptions and guide them to order.";

        String reply = llmClient.generateCompletion(sysPrompt, null, query + "\n\n" + catalogContext);
        if (reply != null && !reply.trim().isEmpty()) {
            return reply;
        }
        return synthesizeFallbackReply(query, cards, savedPlaces, pref);
    }

    private String synthesizeFallbackReply(String query, List<DishRecommendationCardDTO> cards, List<SavedPlace> savedPlaces, UserPreference pref) {
        StringBuilder sb = new StringBuilder();
        sb.append("Welcome to **Cravelle AI**. ");

        if (cards.isEmpty()) {
            sb.append("I couldn't find exact menu matches for that query within your specified filters. ")
              .append("Try asking for popular biryanis, healthy bowls, woodfired pizzas, or food near your saved places (like PES University or Prestige Tech Cloud)!");
            return sb.toString();
        }

        sb.append("Here are handpicked delicacies verified from our local restaurant partners:\n\n");
        for (DishRecommendationCardDTO card : cards) {
            double priceVal = card.getPrice() != null ? card.getPrice().doubleValue() : 0.0;
            sb.append(String.format("• **%s** from *%s* — **₹%.2f** (%s, ~%d mins)\n  *%s*\n\n",
                    card.getName(),
                    card.getRestaurantName(),
                    priceVal,
                    Boolean.TRUE.equals(card.getIsVeg()) ? "🌱 Pure Veg" : "🍗 Non-Veg",
                    card.getDeliveryTimeMinutes() != null ? card.getDeliveryTimeMinutes() : 25,
                    card.getRationale()));
        }

        sb.append("You can click **Order Now** on any card below to add it directly to your bag!");
        return sb.toString();
    }

    private ChatConversation getOrCreateConversation(Long conversationId, User user, String guestSessionId) {
        if (conversationId != null) {
            Optional<ChatConversation> existing = conversationRepository.findById(conversationId);
            if (existing.isPresent()) return existing.get();
        }
        ChatConversation conv = new ChatConversation(user, guestSessionId);
        return conversationRepository.save(conv);
    }

    private void saveMessages(ChatConversation conv, String userQuery, String reply, List<DishRecommendationCardDTO> cards) {
        ChatMessage uMsg = new ChatMessage(conv, "user", userQuery);
        messageRepository.save(uMsg);

        ChatMessage aMsg = new ChatMessage(conv, "assistant", reply);
        messageRepository.save(aMsg);
    }
}
