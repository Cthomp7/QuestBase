package com.questbase.backend.npc;

import java.util.List;

import org.springframework.stereotype.Service;

import com.questbase.backend.auth.AuthService;
import com.questbase.backend.auth.User;
import com.questbase.backend.campaign.Campaign;
import com.questbase.backend.campaign.CampaignRepository;
import com.questbase.backend.npc.dto.CreateNpcRequest;
import com.questbase.backend.npc.dto.NpcResponse;

@Service
public class NpcService {
    
    private final NpcRepository npcRepository;
    private final AuthService authService;
    private final CampaignRepository campaignRepository;

    public NpcService(
        NpcRepository npcRepository,
        AuthService authService,
        CampaignRepository campaignRepository
    ) {
        this.npcRepository = npcRepository;
        this.authService = authService;
        this.campaignRepository = campaignRepository;
    }

    public List<NpcResponse> getAllNpcs() {
        User currentUser = authService.getCurrentUser();

        List<Npc> npcs = npcRepository.findByCampaignUser(currentUser);

        return npcs.stream()
            .map(npc -> toResponse(npc))
            .toList();
    }

    public NpcResponse createNpc(CreateNpcRequest request) {
        User currentUser = authService.getCurrentUser();

        Campaign campaign = campaignRepository.findByIdAndUser(request.campaignId(), currentUser)
            .orElseThrow(() -> new RuntimeException("Campaign not found"));

        Npc npc = Npc.builder()
            .name(request.name())
            .description(request.description())
            .level(request.level())
            .status(request.status())
            .role(request.role())
            .race(request.race())
            .occupation(request.occupation())
            .personality(request.personality())
            .appearance(request.appearance())
            .notes(request.notes())
            .campaign(campaign)
            .build();

        Npc savedNpc = npcRepository.save(npc);
        return toResponse(savedNpc);
    }

    public List<NpcResponse> getNpcsByCampaignId(
        Long campaignId,
        Long userId,
        String sort
    ) {
        boolean ownsCampaign = 
            campaignRepository.existsByIdAndUserId(campaignId, userId);
        
        if (!ownsCampaign) {
            throw new RuntimeException("Campaign not found");
        }

        List<Npc> npcs;
        if ("asc".equalsIgnoreCase(sort)) {
            npcs = npcRepository
                .findByCampaignIdAndCampaignUserIdOrderByCreatedAtAsc(
                    campaignId,
                    userId
                );
        } else {
            npcs = npcRepository
                .findByCampaignIdAndCampaignUserIdOrderByCreatedAtDesc(
                    campaignId,
                    userId
                );
        }

        return npcs.stream()
            .map(npc -> toResponse(npc))
            .toList();
    }

    // =========================================================================
    // HELPER FUNCTIONS
    // =========================================================================

    private NpcResponse toResponse(Npc npc) {
        return NpcResponse.builder()
            .id(npc.getId())
            .name(npc.getName())
            .description(npc.getDescription())
            .level(npc.getLevel())
            .status(npc.getStatus())
            .role(npc.getRole())
            .race(npc.getRace())
            .occupation(npc.getOccupation())
            .personality(npc.getPersonality())
            .appearance(npc.getAppearance())
            .notes(npc.getNotes())
            .createdAt(npc.getCreatedAt())
            .build();
    }
}
