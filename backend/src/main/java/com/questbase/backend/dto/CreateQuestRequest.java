package com.questbase.backend.dto;

import com.questbase.backend.enums.QuestDifficulty;
import com.questbase.backend.enums.QuestStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record CreateQuestRequest (

    @Size(max = 150)
    @NotBlank
    String title,

    @Size(max = 750)
    String description,

    QuestStatus status,
    QuestDifficulty difficulty,

    @Positive
    Integer rewardXp,
    
    @NotNull
    Long campaignId
) {}
