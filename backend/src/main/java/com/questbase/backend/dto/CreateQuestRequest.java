package com.questbase.backend.dto;

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

    private String status; // TODO: switch to enum
    private String difficulty; // TODO: switch to enum
    private Integer rewardXp;
    Long campaignId;
}
