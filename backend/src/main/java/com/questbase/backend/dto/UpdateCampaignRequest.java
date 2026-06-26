package com.questbase.backend.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateCampaignRequest {

    @Size(max = 150)
    private String name;

    @Size(max = 50)
    private String system;

    private String description;
}
