package com.questbase.backend.relationship.campaignInvite.dto;

import java.time.LocalDateTime;

import com.questbase.backend.relationship.campaignInvite.CampaignInvite;
import com.questbase.backend.relationship.campaignInvite.enums.CampaignInviteStatus;

public record CampaignInviteDetailsResponse(
    CampaignInviteStatus status,
    LocalDateTime expiresAt,
    String campaignName
) {
    public static CampaignInviteDetailsResponse from(
        CampaignInvite campaignInvite
    ) {
        return new CampaignInviteDetailsResponse(
            campaignInvite.getStatus(),
            campaignInvite.getExpiresAt(),
            campaignInvite.getCampaign().getName()
        );
    }
}
