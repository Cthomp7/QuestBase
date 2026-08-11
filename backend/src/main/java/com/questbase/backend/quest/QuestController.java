package com.questbase.backend.quest;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.questbase.backend.npc.dto.NpcResponse;
import com.questbase.backend.npc.dto.SaveNpcNotesRequest;
import com.questbase.backend.quest.dto.CreateQuestRequest;
import com.questbase.backend.quest.dto.QuestResponse;
import com.questbase.backend.quest.dto.SaveQuestNotesById;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PutMapping;



@RestController
@RequestMapping("/api/quests")
public class QuestController {
    private final QuestService questService;

    public QuestController(QuestService questService) {
        this.questService = questService;
    }

    @GetMapping("/{id}")
    public QuestResponse getQuestById(@PathVariable Long id) {
        return questService.getQuestById(id);
    }
    
    @GetMapping
    public List<QuestResponse> getAllQuests() {
        return questService.getAllQuests();
    }

    @PostMapping
    public QuestResponse createQuest(
        @Valid @RequestBody CreateQuestRequest request
    ) {
        return questService.createQuest(request);
    }

    @PutMapping("/{id}")
    public QuestResponse updateQuest(
        @PathVariable Long id, 
        @Valid @RequestBody CreateQuestRequest request
    ) {
        return questService.updateQuest(id, request);
    }

    @PatchMapping("/{id}")
    public QuestResponse patchQuest(
        @PathVariable Long id, 
        @Valid @RequestBody CreateQuestRequest request
    ) {
        return questService.patchQuest(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteQuest(@PathVariable Long id) {
        questService.deleteQuest(id);
    }

    @PatchMapping("/{id}/save-notes")
    public QuestResponse saveQuestNotesById(
        @PathVariable Long id,
        @RequestBody SaveQuestNotesById request
    ) {
        return questService.saveQuestNotesById(
            id,
            request.notes()
        );
    }
}
