package com.questbase.backend.quest.dto;

import java.time.LocalDateTime;

import com.questbase.backend.quest.Quest;
import com.questbase.backend.quest.enums.QuestDifficulty;
import com.questbase.backend.quest.enums.QuestStatus;

import lombok.Builder;

@Builder
public record QuestResponse (
    Long id,
    String title,
    String description,
    QuestStatus status,
    QuestDifficulty difficulty,
    Integer rewardXp,
    String notes,
    LocalDateTime createdAt
) {
    public static QuestResponse from(Quest quest) {
        return new QuestResponse(
            quest.getId(),
            quest.getTitle(),
            quest.getDescription(),
            quest.getStatus(),
            quest.getDifficulty(),
            quest.getRewardXp(),
            quest.getNotes(),
            quest.getCreatedAt()
        );
    }
}