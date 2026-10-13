package com.cravelle.controller;

import com.cravelle.chatbot.ChatbotService;
import com.cravelle.dto.ApiResponse;
import com.cravelle.dto.ChatRequest;
import com.cravelle.dto.ChatResponseDTO;
import com.cravelle.entity.User;
import com.cravelle.repository.UserRepository;
import com.cravelle.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@Tag(name = "AI Chatbot", description = "Cravelle AI Food Discovery & Delivery Assistant")
public class ChatbotController {

    private final ChatbotService chatbotService;
    private final UserRepository userRepository;

    public ChatbotController(ChatbotService chatbotService, UserRepository userRepository) {
        this.chatbotService = chatbotService;
        this.userRepository = userRepository;
    }

    @PostMapping
    @Operation(summary = "Chat with Cravelle AI food concierge")
    public ResponseEntity<ApiResponse<ChatResponseDTO>> chat(
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
