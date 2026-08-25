package com.questbase.backend.campaign;

import org.springframework.stereotype.Service;

import com.questbase.backend.exception.InsufficientPermissionException;
import com.questbase.backend.exception.ResourceNotFoundException;
import com.questbase.backend.relationship.campaignMember.CampaignMemberRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CampaignAccessService {
    
    private final CampaignRepository campaignRepository;
    private final CampaignMemberRepository campaignMemberRepository;

    public void requireExists(Long campaignId) {
        if (!campaignRepository.existsById(campaignId)) {
            throw new ResourceNotFoundException("Campaign");
        }
    }

    public boolean canAccess(Long campaignId, Long userId) {
        return campaignRepository.existsByIdAndUserId(campaignId, userId)
            || campaignMemberRepository
                .existsByCampaignIdAndUserId(campaignId, userId);
    }

    public void requireAccess(Long campaignId, Long userId) {
        requireExists(campaignId);
        
        if (!canAccess(campaignId, userId)) {
            throw new InsufficientPermissionException(
                "Requester does not have permission to access this campaign."
            );
        }
    }
}
