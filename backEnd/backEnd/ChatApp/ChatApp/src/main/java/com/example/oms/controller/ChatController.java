package com.example.oms.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.oms.service.ChatService;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:8090", "http://127.0.0.1:5173", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public String chat(
            @RequestParam(defaultValue = "default-session") String conversationId,
            @RequestParam(required = false) String apiKey,
            @RequestHeader(value = "X-Gemini-Api-Key", required = false) String apiKeyHeader,
            @RequestBody(required = false) String message) {

        String queryText = (message != null && !message.trim().isEmpty())
                ? message.trim()
                : "Hello, how can you help with my family health today?";

        String keyToUse = (apiKeyHeader != null && !apiKeyHeader.trim().isEmpty()) ? apiKeyHeader : apiKey;

        return chatService.chat(conversationId, queryText, keyToUse);
    }

}