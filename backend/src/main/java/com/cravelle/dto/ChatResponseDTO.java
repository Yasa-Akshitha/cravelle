package com.cravelle.dto;

import java.util.ArrayList;
import java.util.List;

public class ChatResponseDTO {

    private Long conversationId;
    private String reply;
    private List<ProductRecommendationCardDTO> products = new ArrayList<>();
    private List<String> suggestedQuestions = new ArrayList<>();

    public ChatResponseDTO() {}

    public ChatResponseDTO(Long conversationId, String reply, List<ProductRecommendationCardDTO> products, List<String> suggestedQuestions) {
        this.conversationId = conversationId;
        this.reply = reply;
        this.products = products != null ? products : new ArrayList<>();
        this.suggestedQuestions = suggestedQuestions != null ? suggestedQuestions : new ArrayList<>();
    }

    public Long getConversationId() { return conversationId; }
    public void setConversationId(Long conversationId) { this.conversationId = conversationId; }

    public String getReply() { return reply; }
    public void setReply(String reply) { this.reply = reply; }

    public List<ProductRecommendationCardDTO> getProducts() { return products; }
    public void setProducts(List<ProductRecommendationCardDTO> products) { this.products = products; }

    public List<String> getSuggestedQuestions() { return suggestedQuestions; }
    public void setSuggestedQuestions(List<String> suggestedQuestions) { this.suggestedQuestions = suggestedQuestions; }
}
