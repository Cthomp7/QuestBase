package com.questbase.backend.dto;

import java.time.LocalDateTime;

import com.questbase.backend.entity.Campaign;
import com.questbase.backend.enums.QuestDifficulty;
import com.questbase.backend.enums.QuestStatus;

import lombok.Builder;

@Builder
public record QuestResponse (
    String title,
    String description,
    QuestStatus status,
    QuestDifficulty difficulty,
    Integer rewardXp,
    LocalDateTime createdAt,
    Campaign campaign
) {}
