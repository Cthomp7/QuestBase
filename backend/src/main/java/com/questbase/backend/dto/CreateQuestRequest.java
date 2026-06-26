package com.questbase.backend.dto;

import com.questbase.backend.enums.QuestDifficulty;
import com.questbase.backend.enums.QuestStatus;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateQuestRequest {
    
    @Size(max = 150)
    private String title;

    @Size(max = 750)
    private String description;

    private QuestStatus status;
    private QuestDifficulty difficulty;
    private Integer rewardXp;
    Long campaignId;
}
