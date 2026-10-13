package com.cravelle.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public class ChatRequest {

    @NotBlank(message = "Message cannot be empty")
    @Size(max = 1000, message = "Message exceeds maximum length of 1000 characters")
    private String message;

    private String guestSessionId;
    private Long conversationId;
    private Double latitude;
    private Double longitude;
    private BigDecimal budget;

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

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public BigDecimal getBudget() { return budget; }
    public void setBudget(BigDecimal budget) { this.budget = budget; }
}
