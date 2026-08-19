package com.questbase.backend.relationship.campaignInvite.dto;

import java.time.LocalDateTime;

import com.questbase.backend.relationship.campaignInvite.CampaignInvite;
import com.questbase.backend.relationship.campaignInvite.enums.CampaignInviteStatus;

public record CampaignInviteResponse(
    Long id,
    String email,
    CampaignInviteStatus status,
    LocalDateTime expiresAt,
    LocalDateTime createdAt
) {
    public static CampaignInviteResponse from(CampaignInvite campaignInvite) {
        return new CampaignInviteResponse(
            campaignInvite.getId(),
            campaignInvite.getEmail(),
            campaignInvite.getStatus(),
            campaignInvite.getExpiresAt(),
            campaignInvite.getCreatedAt()
        );
    }
}
