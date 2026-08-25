package com.questbase.backend.relationship.campaignInvite;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.questbase.backend.auth.User;
import com.questbase.backend.auth.service.AuthService;
import com.questbase.backend.campaign.Campaign;
import com.questbase.backend.campaign.CampaignAccessService;
import com.questbase.backend.campaign.CampaignRepository;
import com.questbase.backend.email.EmailService;
import com.questbase.backend.exception.CustomIllegalStateException;
import com.questbase.backend.exception.ResourceNotFoundException;
import com.questbase.backend.relationship.campaignInvite.dto.CampaignInviteDetailsResponse;
import com.questbase.backend.relationship.campaignInvite.dto.CampaignInviteResponse;
import com.questbase.backend.relationship.campaignInvite.dto.CreateCampaignInviteRequest;
import com.questbase.backend.relationship.campaignInvite.enums.CampaignInviteStatus;
import com.questbase.backend.relationship.campaignMember.CampaignMember;
import com.questbase.backend.relationship.campaignMember.CampaignMemberRepository;
import com.questbase.backend.relationship.campaignMember.dto.CampaignMemberResponse;
import com.questbase.backend.relationship.campaignMember.enums.CampaignMemberRole;
import com.questbase.backend.security.secureToken.SecureTokenService;

@Service
public class CampaignInviteService {

    private final AuthService authService;
    private final CampaignAccessService campaignAccessService;
    private final CampaignRepository campaignRepository;
    private final CampaignInviteRepository campaignInviteRepository;
    private final CampaignMemberRepository campaignMemberRepository;
    private final EmailService emailService;
    private final SecureTokenService secureTokenService;

    public CampaignInviteService(
        AuthService authService,
        CampaignAccessService campaignAccessService,
        CampaignRepository campaignRepository,
        CampaignInviteRepository campaignInviteRepository,
        CampaignMemberRepository campaignMemberRepository,
        EmailService emailService,
        SecureTokenService secureTokenService
    ) {
        this.authService = authService;
        this.campaignAccessService = campaignAccessService;
        this.campaignRepository = campaignRepository;
        this.campaignInviteRepository = campaignInviteRepository;
        this.campaignMemberRepository = campaignMemberRepository;
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

        emailService.sendCampaignInvite(request.email(), campaign.getName(), token);

        return CampaignInviteResponse.from(savedInvite);
    }

    public void deleteInvite(Long id) {
        User currentUser = authService.getCurrentUser();

        CampaignInvite invite = campaignInviteRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Invite"));

        campaignAccessService.requireOwner(
            invite.getCampaign().getId(), 
            currentUser.getId()
        );

        campaignInviteRepository.delete(invite);
    }

    public CampaignMemberResponse acceptInvite(String token) {
        User currentUser = authService.getCurrentUser();

        String tokenHash = secureTokenService.hashToken(token);

        CampaignInvite invite = campaignInviteRepository
            .findByTokenHash(tokenHash)
            .orElseThrow(() ->
                new ResourceNotFoundException("Campaign invite")
            );

        checkInviteValidity(invite);

        Campaign campaign = invite.getCampaign();

        if (campaignMemberRepository.existsByCampaignIdAndUserId(
            campaign.getId(),
            currentUser.getId()
        )) {
            throw new CustomIllegalStateException(
                "You are already a member of this campaign."
            );
        }

        CampaignMember member = new CampaignMember();
        member.setCampaign(campaign);
        member.setUser(currentUser);
        member.setRole(CampaignMemberRole.PLAYER);

        CampaignMember savedMember =
            campaignMemberRepository.save(member);

        invite.setStatus(CampaignInviteStatus.ACCEPTED);
        campaignInviteRepository.save(invite);

        return CampaignMemberResponse.from(savedMember);
    }

    public CampaignInviteResponse resendInvite(Long id) {
        User currentUser = authService.getCurrentUser();

        CampaignInvite invite = campaignInviteRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Invite"));

        campaignAccessService.requireOwner(
            invite.getCampaign().getId(), 
            currentUser.getId()
        );

        String token = secureTokenService.generateToken();
        String tokenHash = secureTokenService.hashToken(token);

        invite.setTokenHash(tokenHash);
        invite.setExpiresAt(LocalDateTime.now().plusDays(7));
        invite.setStatus(CampaignInviteStatus.PENDING);

        CampaignInvite savedInvite = campaignInviteRepository.save(invite);

        emailService.sendCampaignInvite(
            invite.getEmail(), 
            invite.getCampaign().getName(), 
            token
        );

        return CampaignInviteResponse.from(savedInvite);
    }

    public CampaignInviteDetailsResponse getInviteDetails(String token) {
        String tokenHash = secureTokenService.hashToken(token);

        CampaignInvite invite = campaignInviteRepository
            .findByTokenHash(tokenHash)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Campaign invite"
                )
            );

        checkInviteValidity(invite);

        return CampaignInviteDetailsResponse.from(invite);
    }

    private void checkInviteValidity(CampaignInvite invite) {
        if (invite.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new CustomIllegalStateException(
                "This invitation has expired."
            );
        }

        if (invite.getStatus() == CampaignInviteStatus.ACCEPTED) {
            throw new CustomIllegalStateException(
                "This invitation has already been accepted."
            );
        }
    }
}
