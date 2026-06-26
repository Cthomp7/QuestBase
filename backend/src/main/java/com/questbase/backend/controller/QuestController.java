package com.questbase.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.questbase.backend.dto.CreateQuestRequest;
import com.questbase.backend.dto.QuestResponse;
import com.questbase.backend.service.QuestService;

@RestController
@RequestMapping("/api/quests")
public class QuestController {
    private final QuestService questService;

    public QuestController(QuestService questService) {
        this.questService = questService;
    }

    @GetMapping
    public List<QuestResponse> getAllQuests() {
        return questService.getAllQuests();
    }

    @PostMapping
    public QuestResponse createQuest(@RequestBody CreateQuestRequest request) {
        return questService.createQuest(request);
    }
}
