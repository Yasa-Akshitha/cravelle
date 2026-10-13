package com.cravelle.controller;

import com.cravelle.chatbot.ChatbotService;
import com.cravelle.dto.*;
import com.cravelle.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@Tag(name = "AI Chatbot", description = "Cravelle AI Personal Fashion Stylist")
public class ChatbotController {

    private final ChatbotService chatbotService;

    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping
    @Operation(summary = "Chat with Cravelle AI shopping assistant")
    public ResponseEntity<ApiResponse<ChatResponseDTO>> chat(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody ChatRequest request) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        ChatResponseDTO response = chatbotService.processChat(userId, request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/history")
    @Operation(summary = "Get conversation history")
    public ResponseEntity<ApiResponse<ChatHistoryResponseDTO>> getHistory(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(required = false) String guestSessionId) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        ChatHistoryResponseDTO history = chatbotService.getHistory(userId, guestSessionId);
        return ResponseEntity.ok(ApiResponse.ok(history));
    }

    @DeleteMapping("/history")
    @Operation(summary = "Clear conversation history")
    public ResponseEntity<ApiResponse<String>> clearHistory(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(required = false) String guestSessionId) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        chatbotService.clearHistory(userId, guestSessionId);
        return ResponseEntity.ok(ApiResponse.ok("Chat history cleared", null));
    }
}
