package com.questbase.backend.relationship.campaignMember;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping("/api/campaign-members")
public class CampaignMemberController {
    final private CampaignMemberService campaignMemberService;

    public CampaignMemberController(
        CampaignMemberService campaignMemberService
    ) {
        this.campaignMemberService = campaignMemberService;
    }

    @DeleteMapping("/{id}")
    public void deleteMember (
        @PathVariable Long id
    ) {
        campaignMemberService.deleteMember(id);
    }
}
