package com.questbase.backend.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CampaignResponse {
    private Long id;
    private String name;
    private String system;
    private String description;
}
