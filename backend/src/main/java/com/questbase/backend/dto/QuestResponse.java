package com.questbase.backend.dto;

import java.time.LocalDateTime;

import com.questbase.backend.entity.Campaign;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class QuestResponse {
    private String title;
    private String description;
    private String status;
    private String difficulty;
    private Integer rewardXp;
    private LocalDateTime createdAt;
    private Campaign campaign;
}
