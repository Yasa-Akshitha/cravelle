package com.cravelle;

import com.cravelle.chatbot.ChatbotService;
import com.cravelle.chatbot.LlmClient;
import com.cravelle.chatbot.StorePolicyService;
import com.cravelle.dto.ChatRequest;
import com.cravelle.dto.ChatResponseDTO;
import com.cravelle.entity.ChatConversation;
import com.cravelle.entity.Product;
import com.cravelle.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChatbotServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private ChatConversationRepository chatConversationRepository;

    @Mock
    private ChatMessageRepository chatMessageRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private StorePolicyService storePolicyService;

    @Mock
    private LlmClient llmClient;

    @InjectMocks
    private ChatbotService chatbotService;

    private ChatConversation sampleConversation;

    @BeforeEach
    void setUp() {
        sampleConversation = new ChatConversation(null, "guest-123");
        sampleConversation.setId(5L);
    }

    @Test
    void testChatbotPolicyInquiryResponse() {
        ChatRequest request = new ChatRequest("What is your return policy?", "guest-123");

        when(chatConversationRepository.findTopByGuestSessionIdOrderByUpdatedAtDesc("guest-123"))
                .thenReturn(Optional.of(sampleConversation));
        when(chatMessageRepository.findByConversationIdOrderByCreatedAtAsc(5L))
                .thenReturn(Collections.emptyList());
        when(productRepository.findAll()).thenReturn(Collections.emptyList());
        when(storePolicyService.getStorePoliciesSummary()).thenReturn("Complimentary 14-day returns.");
        when(llmClient.generateCompletion(any(), any(), any()))
                .thenReturn("At Cravelle, we offer a complimentary 14-day return and exchange policy for unworn items.");

        ChatResponseDTO response = chatbotService.processChat(null, request);

        assertNotNull(response);
        assertTrue(response.getReply().contains("14-day return"));
        assertEquals(5L, response.getConversationId());
        assertFalse(response.getSuggestedQuestions().isEmpty());
    }

    @Test
    void testChatbotValidatesProductIdsAgainstDatabase() {
        ChatRequest request = new ChatRequest("Recommend a silk dress", "guest-123");

        Product realProduct = new Product(null, "Aurelia Silk Slip Dress", "aurelia-silk-slip-dress", "Multiberry silk", new BigDecimal("2899.00"), null, "img.jpg");
        realProduct.setId(1L);

        when(chatConversationRepository.findTopByGuestSessionIdOrderByUpdatedAtDesc("guest-123"))
                .thenReturn(Optional.of(sampleConversation));
        when(chatMessageRepository.findByConversationIdOrderByCreatedAtAsc(5L))
                .thenReturn(Collections.emptyList());
        when(productRepository.findAll()).thenReturn(Collections.singletonList(realProduct));
        when(storePolicyService.getStorePoliciesSummary()).thenReturn("Store Policies");
        when(llmClient.generateCompletion(any(), any(), any()))
                .thenReturn("I recommend the Aurelia Silk Slip Dress [ID: 1] which is gorgeous!");
        when(productRepository.findById(1L)).thenReturn(Optional.of(realProduct));

        ChatResponseDTO response = chatbotService.processChat(null, request);

        assertNotNull(response);
        assertEquals(1, response.getProducts().size());
        assertEquals("Aurelia Silk Slip Dress", response.getProducts().get(0).getName());
        assertEquals(1L, response.getProducts().get(0).getId());
    }
}
