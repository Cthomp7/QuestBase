package com.questbase.backend.relationship.campaignInvite;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.questbase.backend.auth.User;
import com.questbase.backend.auth.service.AuthService;
import com.questbase.backend.campaign.Campaign;
import com.questbase.backend.campaign.CampaignRepository;
import com.questbase.backend.email.EmailService;
import com.questbase.backend.exception.ResourceNotFoundException;
import com.questbase.backend.relationship.campaignInvite.dto.CampaignInviteResponse;
import com.questbase.backend.relationship.campaignInvite.dto.CreateCampaignInviteRequest;
import com.questbase.backend.relationship.campaignInvite.enums.CampaignInviteStatus;
import com.questbase.backend.security.secureToken.SecureTokenService;

@Service
public class CampaignInviteService {

    private final AuthService authService;
    private final CampaignRepository campaignRepository;
    private final CampaignInviteRepository campaignInviteRepository;
    private final EmailService emailService;
    private final SecureTokenService secureTokenService;

    public CampaignInviteService(
        AuthService authService,
        CampaignRepository campaignRepository,
        CampaignInviteRepository campaignInviteRepository,
        EmailService emailService,
        SecureTokenService secureTokenService
    ) {
        this.authService = authService;
        this.campaignRepository = campaignRepository;
        this.campaignInviteRepository = campaignInviteRepository;
        this.emailService = emailService;
        this.secureTokenService = secureTokenService;
    }

    public List<CampaignInviteResponse> getInvites(Long campaignId) {
        User currentUser = authService.getCurrentUser();

        campaignRepository.findByIdAndUser(campaignId, currentUser)
            .orElseThrow(() -> new ResourceNotFoundException("Campaign"));

        List<CampaignInvite> invites = campaignInviteRepository.findByCampaignId(campaignId);

        return invites.stream()
            .map(invite -> CampaignInviteResponse.from(invite))
            .toList();
    }
    
    public CampaignInviteResponse createInvite(
        Long campaignId, 
        CreateCampaignInviteRequest request
    ) {
        User currentUser = authService.getCurrentUser();

        Campaign campaign = campaignRepository.findByIdAndUser(campaignId, currentUser)
            .orElseThrow(() -> new ResourceNotFoundException("Campaign"));

        String token = secureTokenService.generateToken();
        String tokenHash = secureTokenService.hashToken(token);

        CampaignInvite invite = CampaignInvite.builder()
            .campaign(campaign)
            .email(request.email())
            .tokenHash(tokenHash)
            .status(CampaignInviteStatus.PENDING)
            .expiresAt(LocalDateTime.now().plusDays(7))
            .build();

        CampaignInvite savedInvite = campaignInviteRepository.save(invite);

        emailService.sendCampaignInvite(request.email(), campaign.getName(), tokenHash);

        return CampaignInviteResponse.from(savedInvite);
    }
}
