package com.cm.ecohub.controllers;

import com.cm.ecohub.constants.ApiPaths;
import com.cm.ecohub.services.AiService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
public class AiController {
    private final AiService aiService;

    @PostMapping(ApiPaths.AI)
    public String chat(@RequestBody String prompt) {
        return aiService.generateResponse(prompt);
    }
}
