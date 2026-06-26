package com.questbase.backend.dto;

import java.time.LocalDateTime;

import com.questbase.backend.entity.Campaign;
import com.questbase.backend.enums.QuestDifficulty;
import com.questbase.backend.enums.QuestStatus;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class QuestResponse {
    private String title;
    private String description;
    private QuestStatus status;
    private QuestDifficulty difficulty;
    private Integer rewardXp;
    private LocalDateTime createdAt;
    private Campaign campaign;
}
