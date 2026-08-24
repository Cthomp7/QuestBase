package com.questbase.backend.relationship.campaignMember.dto;

import java.time.LocalDateTime;

import com.questbase.backend.auth.dto.UserResponse;
import com.questbase.backend.relationship.campaignMember.CampaignMember;
import com.questbase.backend.relationship.campaignMember.enums.CampaignMemberRole;

public record CampaignMemberResponse(
    Long id,
    Long campaignId,
    UserResponse user,
    CampaignMemberRole role,
    LocalDateTime joinedAt
) {
    public static CampaignMemberResponse from(
        CampaignMember member
    ) {
        UserResponse user = 
            new UserResponse(
                member.getUser().getId(),
                member.getUser().getDisplayName(),
                member.getUser().getEmail(),
                member.getUser().getCreatedAt()
            );

        return new CampaignMemberResponse(
            member.getId(),
            member.getCampaign().getId(),
            user,
            member.getRole(),
            member.getJoinedAt()
        );
    }
}
