package com.questbase.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateCampaignRequest(

    @NotBlank
    @Size(max = 150)
    String name,

    @Size(max = 50)
    String system,

    String description
) {}
