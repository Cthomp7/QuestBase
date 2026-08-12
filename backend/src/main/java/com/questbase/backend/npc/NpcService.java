package com.questbase.backend.npc;

import java.util.List;

import org.springframework.stereotype.Service;

import com.questbase.backend.auth.AuthService;
import com.questbase.backend.auth.User;
import com.questbase.backend.campaign.Campaign;
import com.questbase.backend.campaign.CampaignRepository;
import com.questbase.backend.exception.ResourceNotFoundException;
import com.questbase.backend.npc.dto.CreateNpcRequest;
import com.questbase.backend.npc.dto.NpcQuestResponse;
import com.questbase.backend.npc.dto.NpcResponse;
import com.questbase.backend.relationship.questnpc.QuestNpcRepository;

@Service
public class NpcService {
    
    private final AuthService authService;
    private final CampaignRepository campaignRepository;
    private final NpcRepository npcRepository;
    private final QuestNpcRepository questNpcRepository;

    public NpcService(
        AuthService authService,
        CampaignRepository campaignRepository,
        NpcRepository npcRepository,
        QuestNpcRepository questNpcRepository
    ) {
        this.authService = authService;
        this.campaignRepository = campaignRepository;
        this.npcRepository = npcRepository;
        this.questNpcRepository = questNpcRepository;
    }

    public NpcResponse getNpcById(Long id) {
        User currentUser = authService.getCurrentUser();

        Npc npc = npcRepository.findByIdAndCampaignUser(id, currentUser)
            .orElseThrow(() -> new RuntimeException("NPC not found"));

        return toResponse(npc);
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

    public NpcResponse updateNpc(
        Long id,
        CreateNpcRequest request
    ) {
        User currentUser = authService.getCurrentUser();

        Npc npc = npcRepository
            .findByIdAndCampaignUser(id, currentUser)
            .orElseThrow(() -> new RuntimeException("NPC not found"));

        npc.setName(request.name());
        npc.setDescription(request.description());
        npc.setLevel(request.level());
        npc.setStatus(request.status());
        npc.setRole(request.role());
        npc.setRace(request.race());
        npc.setOccupation(request.occupation());
        npc.setPersonality(request.personality());
        npc.setAppearance(request.appearance());

        Npc savedNpc = npcRepository.save(npc);
        return toResponse(savedNpc);
    }

    public void deleteNpc(Long id) {
        User currentUser = authService.getCurrentUser();

        Npc npc = npcRepository
            .findByIdAndCampaignUser(id, currentUser)
            .orElseThrow(() -> new RuntimeException("NPC not found"));

        npcRepository.delete(npc);
    }

    public NpcResponse saveNpcNotesById(
        Long id,
        String notes
    ) {
        User currentUser = authService.getCurrentUser();

        Npc npc = npcRepository
            .findByIdAndCampaignUser(id, currentUser)
            .orElseThrow(() -> new RuntimeException("NPC not found"));

        npc.setNotes(notes);

        Npc savedNpc = npcRepository.save(npc);

        return toResponse(savedNpc);
    }

    // =========================================================================
    // RELATIONSHIPS
    // =========================================================================

    public List<NpcQuestResponse> getQuestsByNpcId (Long npcId) {
        User currentUser = authService.getCurrentUser();

        if (!npcRepository.existsByIdAndCampaignUserId(npcId, currentUser.getId())) {
            throw new ResourceNotFoundException("NPC");
        }

        return questNpcRepository
            .findByNpcIdAndNpcCampaignUserId(npcId, currentUser.getId())
            .stream()
            .map(NpcQuestResponse::from)
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
