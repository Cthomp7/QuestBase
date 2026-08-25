package com.questbase.backend.campaign.dto;
import com.questbase.backend.relationship.campaignMember.enums.CampaignMemberRole;

import lombok.Builder;

@Builder
public record CampaignResponse (
    Long id,
    String name,
    String system,
    String description,
    CampaignMemberRole role
) {}
