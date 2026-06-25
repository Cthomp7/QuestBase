package com.questbase.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.questbase.backend.entity.Quest;
import com.questbase.backend.service.QuestService;

@RestController
@RequestMapping("/api/quests")
public class QuestController {
    private final QuestService questService;

    public QuestController(QuestService questService) {
        this.questService = questService;
    }

    @GetMapping
    public List<Quest> getAllQuests() {
        return questService.getAllQuests();
    }

    @PostMapping
    public Quest createQuest(@RequestBody Quest quest) {
        return questService.createQuest(quest);
    }
}
