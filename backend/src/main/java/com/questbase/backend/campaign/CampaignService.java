package com.questbase.backend.campaign;

import java.util.List;

import org.springframework.stereotype.Service;

import com.questbase.backend.auth.User;
import com.questbase.backend.auth.service.AuthService;
import com.questbase.backend.campaign.dto.CampaignResponse;
import com.questbase.backend.campaign.dto.CreateCampaignRequest;
import com.questbase.backend.relationship.campaignMember.CampaignMember;
import com.questbase.backend.relationship.campaignMember.CampaignMemberRepository;
import com.questbase.backend.relationship.campaignMember.enums.CampaignMemberRole;

@Service
public class CampaignService {
    
    private final AuthService authService;
    private final CampaignRepository campaignRepository;
    private final CampaignMemberRepository campaignMemberRepository;

    public CampaignService(
        AuthService authService, 
        CampaignRepository campaignRepository,
        CampaignMemberRepository campaignMemberRepository
    ) {
        this.authService = authService;
        this.campaignRepository = campaignRepository;
        this.campaignMemberRepository = campaignMemberRepository;
    }
    
    public CampaignResponse getCampaignById(Long id) {
        User currentUser = authService.getCurrentUser();

        Campaign campaign = campaignRepository.findByIdAndUser(id, currentUser)
            .orElseThrow(() -> new RuntimeException("Campaign not found"));

        return toResponse(campaign, currentUser);
    }

    public List<CampaignResponse> getAllCampaigns() {
        User currentUser = authService.getCurrentUser();

        return campaignRepository
            .findAllAccessibleByUser(currentUser)
            .stream()
            .map(campaign -> toResponse(campaign, currentUser))
            .toList();
    }

    public CampaignResponse createCampaign(CreateCampaignRequest request) {
        User currentUser = authService.getCurrentUser();

        Campaign campaign = Campaign.builder()
            .name(request.name())
            .system(request.system())
            .description(request.description())
            .user(currentUser)
            .build();

        Campaign savedCampaign = campaignRepository.save(campaign);

        return toResponse(savedCampaign, currentUser);
    }

    public CampaignResponse updateCampaign(
        Long id, 
        CreateCampaignRequest request
    ) {
        User currentUser = authService.getCurrentUser();

        Campaign campaign = campaignRepository.findByIdAndUser(id, currentUser)
            .orElseThrow(() -> new RuntimeException("Campaign not found"));

        campaign.setName(request.name());
        campaign.setSystem((request.system()));
        campaign.setDescription(request.description());

        Campaign savedCampaign = campaignRepository.save(campaign);

        return toResponse(savedCampaign, currentUser);
    }

    public CampaignResponse patchCampaign(
        Long id, 
        CreateCampaignRequest request
    ) {
        User currentUser = authService.getCurrentUser();

        Campaign campaign = campaignRepository.findByIdAndUser(id, currentUser)
            .orElseThrow(() -> new RuntimeException("Campaign not found"));

        if (request.name() != null) {
            campaign.setName(request.name());
        }

        if (request.system() != null) {
            campaign.setSystem(request.system());
        }

        if (request.description() != null) {
            campaign.setDescription(request.description());
        }

        Campaign savedCampaign = campaignRepository.save(campaign);

        return toResponse(savedCampaign, currentUser);
    }

    public void deleteCampaign(Long id) {
        User currentUser = authService.getCurrentUser();

        Campaign campaign = campaignRepository.findByIdAndUser(id, currentUser)
            .orElseThrow(() -> new RuntimeException("Campaign not found"));

        campaignRepository.delete(campaign);
    }

    // =========================================================================
    // HELPER FUNCTIONS
    // =========================================================================

    private CampaignResponse toResponse(Campaign campaign, User currentUser) {
        CampaignMemberRole role;

        if (campaign.getUser().getId().equals(currentUser.getId())) {
            role = CampaignMemberRole.OWNER;
        } else {
            role = campaignMemberRepository
                .findByCampaignIdAndUserId(
                    campaign.getId(),
                    currentUser.getId()
                )
                .map(CampaignMember::getRole)
                .orElseThrow();
        }

        return CampaignResponse.builder()
                .id(campaign.getId())
                .name(campaign.getName())
                .system(campaign.getSystem())
                .description(campaign.getDescription())
                .role(role)
                .build();
    }
}
