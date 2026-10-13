package com.cravelle;

import com.cravelle.chatbot.ChatbotService;
import com.cravelle.chatbot.LlmClient;
import com.cravelle.dto.ChatRequest;
import com.cravelle.dto.ChatResponseDTO;
import com.cravelle.entity.*;
import com.cravelle.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChatbotServiceTest {

    @Mock
    private LlmClient llmClient;

    @Mock
    private RestaurantRepository restaurantRepository;

    @Mock
    private DishRepository dishRepository;

    @Mock
    private SavedPlaceRepository savedPlaceRepository;

    @Mock
    private UserPreferenceRepository userPreferenceRepository;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private ChatConversationRepository conversationRepository;

    @Mock
    private ChatMessageRepository messageRepository;

    @InjectMocks
    private ChatbotService chatbotService;

    private Restaurant sampleRestaurant;
    private Dish sampleDish;
    private ChatConversation sampleConversation;

    @BeforeEach
    void setUp() {
        sampleRestaurant = new Restaurant();
        sampleRestaurant.setId(1L);
        sampleRestaurant.setName("Meghana Foods");
        sampleRestaurant.setLatitude(12.9352);
        sampleRestaurant.setLongitude(77.6245);
        sampleRestaurant.setIsOpen(true);
        sampleRestaurant.setDeliveryTimeMinutes(25);

        sampleDish = new Dish();
        sampleDish.setId(10L);
        sampleDish.setName("Chicken Dum Biryani");
        sampleDish.setRestaurant(sampleRestaurant);
        sampleDish.setPrice(BigDecimal.valueOf(310.00));
        sampleDish.setIsVeg(false);
        sampleDish.setIsAvailable(true);
        sampleDish.setRating(BigDecimal.valueOf(4.8));

        sampleConversation = new ChatConversation(null, "guest-123");
        sampleConversation.setId(1L);
    }

    @Test
    void testChatbotFoodRecommendation() {
        ChatRequest request = new ChatRequest("Recommend the best biryani near Koramangala", "guest-123");

        when(conversationRepository.save(any(ChatConversation.class))).thenReturn(sampleConversation);
        when(restaurantRepository.findAll()).thenReturn(List.of(sampleRestaurant));
        when(dishRepository.findAll()).thenReturn(List.of(sampleDish));
        when(llmClient.isConfigured()).thenReturn(false);

        ChatResponseDTO response = chatbotService.processChat(request, null);

        assertNotNull(response);
        assertNotNull(response.getReply());
        assertTrue(response.getReply().contains("Meghana Foods") || response.getReply().contains("Cravelle AI"));
        assertFalse(response.getDishes().isEmpty());
        assertEquals("Chicken Dum Biryani", response.getDishes().get(0).getName());
    }
}
