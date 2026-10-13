package com.cravelle.dto;

import java.util.ArrayList;
import java.util.List;

public class ChatHistoryResponseDTO {

    private Long conversationId;
    private List<ChatMessageDTO> messages = new ArrayList<>();

    public ChatHistoryResponseDTO() {}

    public ChatHistoryResponseDTO(Long conversationId, List<ChatMessageDTO> messages) {
        this.conversationId = conversationId;
        this.messages = messages != null ? messages : new ArrayList<>();
    }

    public Long getConversationId() { return conversationId; }
    public void setConversationId(Long conversationId) { this.conversationId = conversationId; }

    public List<ChatMessageDTO> getMessages() { return messages; }
    public void setMessages(List<ChatMessageDTO> messages) { this.messages = messages; }
}
