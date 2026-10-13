package com.cravelle.dto;

import java.time.LocalDateTime;

public class ChatMessageDTO {

    private Long id;
    private String role;
    private String message;
    private LocalDateTime createdAt;

    public ChatMessageDTO() {}

    public ChatMessageDTO(Long id, String role, String message, LocalDateTime createdAt) {
        this.id = id;
        this.role = role;
        this.message = message;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
