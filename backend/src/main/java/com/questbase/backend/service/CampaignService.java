package com.questbase.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.questbase.backend.entity.Campaign;
import com.questbase.backend.repository.CampaignRepository;

@Service
public class CampaignService {
    
    private final CampaignRepository campaignRepository;

    public CampaignService(CampaignRepository campaignRepository) {
        this.campaignRepository = campaignRepository;
    }
    
    public Optional<Campaign> getCampaignById(Long id) {
        return campaignRepository.findById(id);
    }

    public List<Campaign> getAllCampaigns() {
        return campaignRepository.findAll();
    }

    public Campaign createCampaign(Campaign campaign) {
        return campaignRepository.save(campaign);
    }

    public Campaign updateCampaign(Long id, Campaign updatedCampaign) {
        Campaign campaign = campaignRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Campaign not found"));

        campaign.setName(updatedCampaign.getName());
        campaign.setSystem((updatedCampaign.getSystem()));
        campaign.setDescription(updatedCampaign.getDescription());

        return campaignRepository.save(campaign);
    }

    public Campaign patchCampaign(Long id, Campaign updatedCampaign) {
        Campaign campaign = campaignRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Campaign not found"));

        if (updatedCampaign.getName() != null) {
            campaign.setName(updatedCampaign.getName());
        }

        if (updatedCampaign.getSystem() != null) {
            campaign.setSystem(updatedCampaign.getSystem());
        }

        if (updatedCampaign.getDescription() != null) {
            campaign.setDescription(updatedCampaign.getDescription());
        }

        return campaignRepository.save(campaign);
    }

    public void deleteCampaign(Long id) {
        campaignRepository.deleteById(id);
    }
}
