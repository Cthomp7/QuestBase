package com.questbase.backend.relationship.campaignInvite;

import org.springframework.web.bind.annotation.RestController;

import com.questbase.backend.relationship.campaignInvite.dto.CampaignInviteDetailsResponse;
import com.questbase.backend.relationship.campaignInvite.dto.CampaignInviteResponse;
import com.questbase.backend.relationship.campaignMember.dto.CampaignMemberResponse;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping("/api/campaign-invites")
public class CampaignInviteController {

    private final CampaignInviteService campaignInviteService;
    
    public CampaignInviteController(
        CampaignInviteService campaignInviteService
    ) {
        this.campaignInviteService = campaignInviteService;
    }
    
    @GetMapping("/{token}")
    public CampaignInviteDetailsResponse getInviteDetails (
        @PathVariable String token
    ) {
        return campaignInviteService.getInviteDetails(token);
    }

    @PostMapping("/{token}/accept")
    public CampaignMemberResponse acceptInvite (
        @PathVariable String token
    ) {
        return campaignInviteService.acceptInvite(token);
    }

    @PostMapping("/{id}/resend")
    public CampaignInviteResponse resendInvite (
        @PathVariable Long id
    ) {
        return campaignInviteService.resendInvite(id);
    }

    @DeleteMapping("/{id}")
    public void deleteInvite (
        @PathVariable Long id
    ) {
        campaignInviteService.deleteInvite(id);
    }
}
