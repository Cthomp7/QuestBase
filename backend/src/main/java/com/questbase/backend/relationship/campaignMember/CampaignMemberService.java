package com.questbase.backend.relationship.campaignMember;

import java.util.List;

import org.springframework.stereotype.Service;

import com.questbase.backend.auth.User;
import com.questbase.backend.auth.service.AuthService;
import com.questbase.backend.campaign.CampaignAccessService;
import com.questbase.backend.campaign.CampaignRepository;
import com.questbase.backend.exception.InsufficientPermissionException;
import com.questbase.backend.exception.ResourceNotFoundException;
import com.questbase.backend.relationship.campaignMember.dto.CampaignMemberResponse;

@Service
public class CampaignMemberService {
    private final AuthService authService;
    private final CampaignAccessService campaignAccessService;
    private final CampaignRepository campaignRepository;
    private final CampaignMemberRepository campaignMemberRepository;

    public CampaignMemberService(
        AuthService authService,
        CampaignAccessService campaignAccessService,
        CampaignRepository campaignRepository,
        CampaignMemberRepository campaignMemberRepository
    ) {
        this.authService = authService;
        this.campaignAccessService = campaignAccessService;
        this.campaignRepository = campaignRepository;
        this.campaignMemberRepository = campaignMemberRepository;
    }

    public List<CampaignMemberResponse> getPlayers(Long campaignId) {
        User currentUser = authService.getCurrentUser();

        if (!campaignRepository.existsByIdAndUserId(campaignId, currentUser.getId())) {
            throw new InsufficientPermissionException(
                "Requester does not have permission to view campaign members."
            );
        }

        List<CampaignMember> campaignMembers = 
            campaignMemberRepository.findByCampaignIdAndCampaignUserId(
                campaignId, 
                currentUser.getId()
            );

        return campaignMembers.stream()
            .map(member -> CampaignMemberResponse.from(member))
            .toList();
    }

    public void deleteMember(Long id) {
        User currentUser = authService.getCurrentUser();

        CampaignMember member = campaignMemberRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Campaign member"));

        campaignAccessService.requireOwner(
            member.getCampaign().getId(), 
            currentUser.getId()
        );

        campaignMemberRepository.delete(member);
    }
}
