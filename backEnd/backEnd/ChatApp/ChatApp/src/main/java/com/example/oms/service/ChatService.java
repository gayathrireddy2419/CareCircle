package com.example.oms.service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.example.oms.client.AuthHttpClient;
import com.example.oms.dto.response.InternalUserResponse;

@Service
public class ChatService {

    private final ChatClient chatClient;
    private final AuthHttpClient authHttpClient;
    private final String configuredApiKey;

    public ChatService(@Autowired(required = false) ChatClient chatClient,
                       AuthHttpClient authHttpClient,
                       @Value("${gemini.api.key:}") String configuredApiKey) {

        this.chatClient = chatClient;
        this.authHttpClient = authHttpClient;
        this.configuredApiKey = configuredApiKey;
    }

    public String chat(String conversationId, String message) {
        return chat(conversationId, message, null);
    }

    public String chat(String conversationId, String message, String apiKeyOverride) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String userId = null;
        if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getName())) {
            userId = authentication.getName();
        }

        InternalUserResponse user = null;
        if (userId != null) {
            try {
                user = authHttpClient.getInternalUser(UUID.fromString(userId));
            } catch (Exception e) {
                System.err.println("Could not fetch user details from Auth Service: " + e.getMessage());
            }
        }

        String userName = (user != null && user.getFullName() != null) ? user.getFullName() : "CareCircle User";
        String userRole = (user != null && user.getRole() != null) ? user.getRole() : "FAMILY_MEMBER";
        String safeConvId = (conversationId != null ? conversationId : "default-session") + "-" + (userId != null ? userId : "guest");

        String prompt = """
                User Details:
                Name: %s
                Role: %s

                User Question:
                %s
                """
                .formatted(userName, userRole, message);

        // Tier 1: Try Spring AI Gemini ChatClient
        if (chatClient != null) {
            try {
                String aiResponse = chatClient.prompt()
                        .user(prompt)
                        .advisors(advisor ->
                                advisor.param(
                                        ChatMemory.CONVERSATION_ID,
                                        safeConvId))
                        .call()
                        .content();

                if (aiResponse != null && !aiResponse.trim().isEmpty()) {
                    return aiResponse;
                }
            } catch (Exception e) {
                System.err.println("Spring AI ChatClient call failed, falling back to direct Gemini API: " + e.getMessage());
            }
        }

        // Tier 2: Try Direct Gemini REST API call if apiKeyOverride, configuredApiKey, or GEMINI_API_KEY env is available
        String apiKeyToUse = (apiKeyOverride != null && !apiKeyOverride.trim().isEmpty())
                ? apiKeyOverride.trim()
                : ((configuredApiKey != null && !configuredApiKey.trim().isEmpty())
                        ? configuredApiKey.trim()
                        : System.getenv("GEMINI_API_KEY"));

        if (apiKeyToUse != null && !apiKeyToUse.trim().isEmpty()) {
            String directResponse = callGeminiRestApiDirectly(apiKeyToUse.trim(), prompt);
            if (directResponse != null && !directResponse.trim().isEmpty()) {
                return directResponse;
            }
        }

        // Tier 3: Intelligent Dynamic Healthcare Clinical Guidance Engine
        return generateFallbackHealthReply(message, userName);
    }

    private String callGeminiRestApiDirectly(String apiKey, String promptText) {
        String[] models = new String[] {
            "gemini-3.5-flash",
            "gemini-2.0-flash",
            "gemini-1.5-flash",
            "gemini-1.5-pro"
        };

        for (String modelName : models) {
            try {
                RestClient restClient = RestClient.create();
                String url = "https://generativelanguage.googleapis.com/v1beta/models/" + modelName + ":generateContent?key=" + apiKey;

                Map<String, Object> requestBody = Map.of(
                    "contents", List.of(
                        Map.of("parts", List.of(
                            Map.of("text", "You are CareCircle AI Healthcare Assistant & Medical Advisor. Provide compassionate, clear, medical guidance for family health.\n\n" + promptText)
                        ))
                    )
                );

                Map response = restClient.post()
                        .uri(url)
                        .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                        .body(requestBody)
                        .retrieve()
                        .body(Map.class);

                if (response != null && response.containsKey("candidates")) {
                    List candidates = (List) response.get("candidates");
                    if (candidates != null && !candidates.isEmpty()) {
                        Map firstCand = (Map) candidates.get(0);
                        Map content = (Map) firstCand.get("content");
                        if (content != null && content.containsKey("parts")) {
                            List parts = (List) content.get("parts");
                            if (parts != null && !parts.isEmpty()) {
                                Map firstPart = (Map) parts.get(0);
                                String resText = (String) firstPart.get("text");
                                if (resText != null && !resText.trim().isEmpty()) {
                                    return resText;
                                }
                            }
                        }
                    }
                }
            } catch (Exception e) {
                System.err.println("Direct Gemini REST API call failed for model " + modelName + ": " + e.getMessage());
            }
        }
        return null;
    }

    private String generateFallbackHealthReply(String query, String userName) {
        String lower = (query != null) ? query.toLowerCase() : "";

        if (lower.contains("fever") || lower.contains("temperature") || lower.contains("chills")) {
            return String.format("Hello %s, for fever management:\n\n1. Rest adequately and maintain fluid intake (water, ORS, clear broths).\n2. Monitor body temperature every 4 hours.\n3. Use over-the-counter antipyretics like Paracetamol if recommended by a physician.\n4. Seek immediate emergency care if fever exceeds 102°F (38.9°C), or if accompanied by difficulty breathing, severe neck stiffness, or confusion.", userName);
        } else if (lower.contains("headache") || lower.contains("head pain") || lower.contains("migraine")) {
            return String.format("Hello %s, for headaches:\n\n1. Rest in a quiet, dark room and stay hydrated.\n2. Apply a cool or warm compress to your forehead or neck.\n3. Track migraine triggers such as stress, lack of sleep, or screen strain.\n4. Consult a physician if the headache is sudden and unusually severe.", userName);
        } else if (lower.contains("throat") || lower.contains("cough") || lower.contains("cold") || lower.contains("flu")) {
            return String.format("Hello %s, for sore throat and respiratory symptoms:\n\n1. Gargle with warm salt water 2-3 times daily.\n2. Sip warm teas with honey and ginger.\n3. Use steam inhalation to clear nasal passages.\n4. Consult a doctor if throat pain persists beyond 3-5 days or if high fever develops.", userName);
        } else if (lower.contains("bp") || lower.contains("blood pressure") || lower.contains("hypertension")) {
            return String.format("Hello %s, healthy adult blood pressure is generally below 120/80 mmHg.\n\n1. Reduce dietary sodium intake.\n2. Engage in 30 minutes of daily brisk activity.\n3. Record daily morning/evening readings in CareCircle Health Vitals.\n4. Seek urgent medical evaluation if BP exceeds 180/120 mmHg.", userName);
        } else if (lower.contains("sugar") || lower.contains("diabetes") || lower.contains("glucose")) {
            return String.format("Hello %s, normal fasting blood glucose ranges between 70-99 mg/dL.\n\n1. Consume balanced low-GI carbohydrates.\n2. Log daily pre/post-meal glucose values in CareCircle Vitals.\n3. Take prescribed insulin/oral hypoglycemia medications on schedule.\n4. Keep fast-acting glucose tablets nearby for hypoglycemic episodes (<70 mg/dL).", userName);
        } else if (lower.contains("medicine") || lower.contains("dose") || lower.contains("tablet") || lower.contains("prescription")) {
            return String.format("Hello %s, under CareCircle Medicine Manager:\n\n1. You can log doses taken, view active schedules, and track expiry dates.\n2. When you click 'Log Dose Taken', your inventory stock automatically decreases by 1 tablet.\n3. Low stock warning badges appear when quantity falls below 5 tablets.", userName);
        } else if (lower.contains("diet") || lower.contains("food") || lower.contains("nutrition") || lower.contains("eat")) {
            return String.format("Hello %s, for optimal health & nutrition:\n\n1. Prioritize whole foods, fiber-rich vegetables, lean proteins, and healthy fats.\n2. Aim for 2.5-3 liters of water daily.\n3. Limit processed sugars and ultra-processed snacks.", userName);
        } else {
            return String.format("Hello %s, regarding your question (\"%s\"):\n\nAs your CareCircle Medical Advisor, I recommend prioritizing restful sleep, balanced hydration, and monitoring your daily health metrics. If you are experiencing physical discomfort or concerning symptoms, please log them in CareCircle Vitals or consult a certified physician for personalized medical evaluation.", userName, query);
        }
    }
}
