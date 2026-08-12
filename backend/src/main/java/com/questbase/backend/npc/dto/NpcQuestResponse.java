package com.questbase.backend.npc.dto;

import com.questbase.backend.quest.dto.QuestResponse;
import com.questbase.backend.relationship.questnpc.QuestNpc;

public record NpcQuestResponse (
  Long id,
  Long questId,
  Long npcId,
  String role,
  String notes,
  QuestResponse quest
) {
    public static NpcQuestResponse from(QuestNpc questNpc) {
    return new NpcQuestResponse(
        questNpc.getId(),
        questNpc.getQuest().getId(),
        questNpc.getNpc().getId(),
        questNpc.getRole(),
        questNpc.getNotes(),
        QuestResponse.from(questNpc.getQuest())
    );
}
}
