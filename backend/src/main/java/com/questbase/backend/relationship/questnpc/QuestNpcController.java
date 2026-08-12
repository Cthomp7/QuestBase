package com.questbase.backend.relationship.questnpc;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.questbase.backend.relationship.questnpc.dto.CreateQuestNpcRequest;
import com.questbase.backend.relationship.questnpc.dto.QuestNpcResponse;
import com.questbase.backend.relationship.questnpc.dto.UpdateQuestNpcRequest;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/api/quest-npcs")
public class QuestNpcController {
    private final QuestNpcService questnpcService;

    public QuestNpcController(QuestNpcService questnpcService) {
        this.questnpcService = questnpcService;
    }

    @PostMapping
    public QuestNpcResponse createQuestNpc (
        @Valid @RequestBody CreateQuestNpcRequest request
    ) {
        return questnpcService.createQuestNpc(request);
    }

    @PutMapping("/{id}")
    public QuestNpcResponse updateQuestNpc (
        @PathVariable Long id,
        @Valid @RequestBody UpdateQuestNpcRequest request
    ) {
        return questnpcService.updateQuestNpc(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteQuestNpc (
        @PathVariable Long id
    ) {
        questnpcService.deleteQuestNpc(id);
    }
}
