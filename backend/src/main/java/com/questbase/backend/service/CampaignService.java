package com.questbase.backend.service;

import com.questbase.backend.repository.UserRepository;
import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.questbase.backend.dto.CampaignResponse;
import com.questbase.backend.dto.CreateCampaignRequest;
import com.questbase.backend.entity.Campaign;
import com.questbase.backend.entity.User;
import com.questbase.backend.repository.CampaignRepository;

@Service
public class CampaignService {
    
    private final UserRepository userRepository;
    private final CampaignRepository campaignRepository;

    public CampaignService(CampaignRepository campaignRepository, UserRepository userRepository) {
        this.campaignRepository = campaignRepository;
        this.userRepository = userRepository;
    }
    
    public CampaignResponse getCampaignById(Long id) {
        User currentUser = getCurrentUser();

        Campaign campaign = campaignRepository.findByIdAndUser(id, currentUser)
            .orElseThrow(() -> new RuntimeException("Campaign not found"));

        return toResponse(campaign);
    }

    public List<CampaignResponse> getAllCampaigns() {
        User currentUser = getCurrentUser();

        List<Campaign> campaigns = campaignRepository.findByUser(currentUser);

        return campaigns.stream()
            .map(campaign -> toResponse(campaign))
            .toList();
    }

    public CampaignResponse createCampaign(CreateCampaignRequest request) {
        User currentUser = getCurrentUser();

        Campaign campaign = Campaign.builder()
            .name(request.name())
            .system(request.system())
            .description(request.description())
            .user(currentUser)
            .build();

        Campaign savedCampaign = campaignRepository.save(campaign);

        return toResponse(savedCampaign);
    }

    public CampaignResponse updateCampaign(
        Long id, 
        CreateCampaignRequest request
    ) {
        User currentUser = getCurrentUser();

        Campaign campaign = campaignRepository.findByIdAndUser(id, currentUser)
            .orElseThrow(() -> new RuntimeException("Campaign not found"));

        campaign.setName(request.name());
        campaign.setSystem((request.system()));
        campaign.setDescription(request.description());

        Campaign savedCampaign = campaignRepository.save(campaign);

        return toResponse(savedCampaign);
    }

    public CampaignResponse patchCampaign(
        Long id, 
        CreateCampaignRequest request
    ) {
        User currentUser = getCurrentUser();

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

        return toResponse(savedCampaign);
    }

    public void deleteCampaign(Long id) {
        User currentUser = getCurrentUser();

        Campaign campaign = campaignRepository.findByIdAndUser(id, currentUser)
            .orElseThrow(() -> new RuntimeException("Campaign not found"));

        campaignRepository.delete(campaign);
    }

    // =========================================================================
    // HELPER FUNCTIONS
    // =========================================================================

    private User getCurrentUser() {
        String email = SecurityContextHolder
            .getContext()
            .getAuthentication()
            .getName();

        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private CampaignResponse toResponse(Campaign campaign) {
        return CampaignResponse.builder()
                .id(campaign.getId())
                .name(campaign.getName())
                .system(campaign.getSystem())
                .description(campaign.getDescription())
                .build();
    }
}
