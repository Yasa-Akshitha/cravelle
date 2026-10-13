package com.cravelle.chatbot;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class LlmClient {

    private static final Logger logger = LoggerFactory.getLogger(LlmClient.class);

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    @Value("${cravelle.ai.api-key:}")
    private String apiKey;

    @Value("${cravelle.ai.model:gemini-1.5-flash}")
    private String model;

    @Value("${cravelle.ai.base-url:https://generativelanguage.googleapis.com/v1beta/openai}")
    private String baseUrl;

    @Value("${cravelle.ai.timeout-seconds:25}")
    private int timeoutSeconds;

    public LlmClient(ObjectMapper objectMapper) {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
        this.objectMapper = objectMapper;
    }

    public boolean isConfigured() {
        return apiKey != null && !apiKey.trim().isEmpty();
    }

    public String generateCompletion(String systemPrompt, List<Map<String, String>> conversationHistory, String userMessage) {
        if (!isConfigured()) {
            logger.info("AI_API_KEY is not configured. Falling back to local catalog assistant engine.");
            return null;
        }

        try {
            List<Map<String, String>> messages = new ArrayList<>();

            // System prompt
            Map<String, String> sysMsg = new HashMap<>();
            sysMsg.put("role", "system");
            sysMsg.put("content", systemPrompt);
            messages.add(sysMsg);

            // History
            if (conversationHistory != null) {
                messages.addAll(conversationHistory);
            }

            // Current message
            Map<String, String> uMsg = new HashMap<>();
            uMsg.put("role", "user");
            uMsg.put("content", userMessage);
            messages.add(uMsg);

            Map<String, Object> requestBodyMap = new HashMap<>();
            requestBodyMap.put("model", model);
            requestBodyMap.put("messages", messages);
            requestBodyMap.put("temperature", 0.7);
            requestBodyMap.put("max_tokens", 800);

            String requestBodyJson = objectMapper.writeValueAsString(requestBodyMap);

            String endpoint = baseUrl.endsWith("/") ? baseUrl + "chat/completions" : baseUrl + "/chat/completions";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(endpoint))
                    .timeout(Duration.ofSeconds(timeoutSeconds))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey.trim())
                    .POST(HttpRequest.BodyPublishers.ofString(requestBodyJson))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonNode root = objectMapper.readTree(response.body());
                JsonNode choices = root.path("choices");
                if (choices.isArray() && choices.size() > 0) {
                    return choices.get(0).path("message").path("content").asText();
                }
            } else {
                logger.warn("LLM API call returned status {}: {}", response.statusCode(), response.body());
            }
        } catch (Exception ex) {
            logger.error("Exception occurred while communicating with LLM provider: {}", ex.getMessage());
        }

        return null;
    }
}
