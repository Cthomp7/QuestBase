package com.questbase.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.questbase.backend.dto.CampaignResponse;
import com.questbase.backend.dto.CreateCampaignRequest;
import com.questbase.backend.entity.Campaign;
import com.questbase.backend.repository.CampaignRepository;

@Service
public class CampaignService {
    
    private final CampaignRepository campaignRepository;

    public CampaignService(CampaignRepository campaignRepository) {
        this.campaignRepository = campaignRepository;
    }
    
    public CampaignResponse getCampaignById(Long id) {
        Campaign campaign = campaignRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Campaign not found"));

        return toResponse(campaign);
    }

    public List<CampaignResponse> getAllCampaigns() {
        List<Campaign> campaigns = campaignRepository.findAll();

        return campaigns.stream()
            .map(campaign -> toResponse(campaign))
            .toList();
    }

    public CampaignResponse createCampaign(CreateCampaignRequest request) {
        Campaign campaign = Campaign.builder()
            .name(request.name())
            .system(request.system())
            .description(request.description())
            .build();

        Campaign savedCampaign = campaignRepository.save(campaign);

        return toResponse(savedCampaign);
    }

    public CampaignResponse updateCampaign(
        Long id, 
        CreateCampaignRequest request
    ) {
        Campaign campaign = campaignRepository.findById(id)
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
        Campaign campaign = campaignRepository.findById(id)
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
        campaignRepository.deleteById(id);
    }

    // =========================================================================
    // HELPER FUNCTIONS
    // =========================================================================

    private CampaignResponse toResponse(Campaign campaign) {
        return CampaignResponse.builder()
                .id(campaign.getId())
                .name(campaign.getName())
                .system(campaign.getSystem())
                .description(campaign.getDescription())
                .build();
    }
}
