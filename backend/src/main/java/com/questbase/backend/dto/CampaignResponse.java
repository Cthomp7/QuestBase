package com.questbase.backend.dto;

import lombok.Builder;

@Builder
public record CampaignResponse (
    Long id,
    String name,
    String system,
    String description
) {}
