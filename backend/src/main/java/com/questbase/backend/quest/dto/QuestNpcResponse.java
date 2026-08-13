package com.questbase.backend.quest.dto;

import com.questbase.backend.npc.dto.NpcResponse;
import com.questbase.backend.relationship.questnpc.QuestNpc;

public record QuestNpcResponse (
  Long id,
  Long questId,
  Long npcId,
  String role,
  String notes,
  NpcResponse npc
) {
    public static QuestNpcResponse from(QuestNpc questNpc) {
        return new QuestNpcResponse(
            questNpc.getId(),
            questNpc.getQuest().getId(),
            questNpc.getNpc().getId(),
            questNpc.getRole(),
            questNpc.getNotes(),
            NpcResponse.from(questNpc.getNpc())
        );
    }
}