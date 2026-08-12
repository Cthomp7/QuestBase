package com.questbase.backend.relationship.questnpc.dto;

import com.questbase.backend.relationship.questnpc.QuestNpc;

public record QuestNpcResponse(
    Long id,
    Long questId,
    Long npcId,
    String role,
    String notes
) {
    public static QuestNpcResponse from(QuestNpc questNpc) {
        return new QuestNpcResponse(
            questNpc.getId(),
            questNpc.getQuest().getId(),
            questNpc.getNpc().getId(),
            questNpc.getRole(),
            questNpc.getNotes()
        );
    }
}
