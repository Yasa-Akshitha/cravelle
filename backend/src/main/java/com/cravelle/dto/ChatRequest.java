package com.cravelle.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ChatRequest {

    @NotBlank(message = "Message cannot be empty")
    @Size(max = 1000, message = "Message exceeds maximum length of 1000 characters")
    private String message;

    private String guestSessionId;
    private Long conversationId;

    public ChatRequest() {}

    public ChatRequest(String message, String guestSessionId) {
        this.message = message;
        this.guestSessionId = guestSessionId;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getGuestSessionId() { return guestSessionId; }
    public void setGuestSessionId(String guestSessionId) { this.guestSessionId = guestSessionId; }

    public Long getConversationId() { return conversationId; }
    public void setConversationId(Long conversationId) { this.conversationId = conversationId; }
}
