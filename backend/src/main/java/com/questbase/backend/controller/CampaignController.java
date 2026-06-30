package com.questbase.backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.questbase.backend.dto.CampaignResponse;
import com.questbase.backend.dto.CreateCampaignRequest;
import com.questbase.backend.service.CampaignService;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;



@RestController
@RequestMapping("/api/campaigns")
public class CampaignController {
    private final CampaignService campaignService;

    public CampaignController(CampaignService campaignService) {
        this.campaignService = campaignService;
    }

    @GetMapping("/{id}")
    public CampaignResponse getCampaignById(@PathVariable Long id) {
        return campaignService.getCampaignById(id);
    }

    @GetMapping()
    public List<CampaignResponse> getAllCampaigns() {
        return campaignService.getAllCampaigns();
    }

    @PostMapping()
    public CampaignResponse createCampaign(
        @Valid @RequestBody CreateCampaignRequest request
    ) {
        return campaignService.createCampaign(request);
    }

    @PutMapping("/{id}")
    public CampaignResponse updateCampaign(
        @PathVariable Long id, 
        @Valid @RequestBody CreateCampaignRequest request
    ) {
        return campaignService.updateCampaign(id, request);
    }

    @PatchMapping("/{id}")
    public CampaignResponse patchCampaign(
        @PathVariable Long id,
        @Valid @RequestBody CreateCampaignRequest request
    ) {
        return campaignService.patchCampaign(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteCampaign(@PathVariable Long id) {
        campaignService.deleteCampaign(id);
    }
}
