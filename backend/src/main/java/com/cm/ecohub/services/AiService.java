package com.cm.ecohub.services;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Slf4j
@Service
public class AiService {
    private final ChatClient chatClient;

    public String generateResponse(String prompt) {
        try {
            return chatClient.prompt()
                    .user(prompt)
                    .call()
                    .content();
        } catch (Exception e) {
            return e.getMessage();
        }
    }
}

