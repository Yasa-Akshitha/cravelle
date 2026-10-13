package com.cravelle.controller;

import com.cravelle.dto.ApiResponse;
import com.cravelle.dto.ChatRequest;
import com.cravelle.dto.ChatResponseDTO;
import com.cravelle.dto.RecommendationResponse;
import com.cravelle.entity.User;
import com.cravelle.recommendation.RecommendationEngine;
import com.cravelle.repository.UserRepository;
import com.cravelle.security.UserPrincipal;
import com.cravelle.chatbot.ChatbotService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recommendations")
@Tag(name = "Recommendations", description = "AI & location-based food recommendations")
public class RecommendationController {

    private final RecommendationEngine recommendationEngine;
    private final ChatbotService chatbotService;
    private final UserRepository userRepository;

    public RecommendationController(RecommendationEngine recommendationEngine,
                                    ChatbotService chatbotService,
                                    UserRepository userRepository) {
        this.recommendationEngine = recommendationEngine;
        this.chatbotService = chatbotService;
        this.userRepository = userRepository;
    }

    @GetMapping("/nearby")
    @Operation(summary = "Get recommendations based on current location and places visited")
    public ResponseEntity<ApiResponse<RecommendationResponse>> getRecommendations(
            @RequestParam(required = false, defaultValue = "12.9716") Double latitude,
            @RequestParam(required = false, defaultValue = "77.5946") Double longitude,
            @RequestParam(required = false) String locationName,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        RecommendationResponse response = recommendationEngine.getRecommendations(latitude, longitude, userId, locationName);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/personalized")
    @Operation(summary = "Get personalized food discovery for authenticated user")
    public ResponseEntity<ApiResponse<RecommendationResponse>> getPersonalizedRecommendations(
            @RequestParam(required = false, defaultValue = "12.9716") Double latitude,
            @RequestParam(required = false, defaultValue = "77.5946") Double longitude,
            @RequestParam(required = false) String locationName,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        RecommendationResponse response = recommendationEngine.getRecommendations(latitude, longitude, userId, locationName);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/ask")
    @Operation(summary = "Ask Cravelle AI for dish recommendations")
    public ResponseEntity<ApiResponse<ChatResponseDTO>> askFoodAssistant(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody ChatRequest request) {

        User user = null;
        if (userPrincipal != null) {
            user = userRepository.findById(userPrincipal.getId()).orElse(null);
        }

        ChatResponseDTO response = chatbotService.processChat(request, user);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
