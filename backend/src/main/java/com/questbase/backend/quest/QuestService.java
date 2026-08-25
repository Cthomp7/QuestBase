package com.questbase.backend.quest;

import com.questbase.backend.auth.User;
import com.questbase.backend.auth.service.AuthService;
import com.questbase.backend.campaign.Campaign;
import com.questbase.backend.campaign.CampaignAccessService;
import com.questbase.backend.campaign.CampaignRepository;
import com.questbase.backend.exception.ResourceNotFoundException;
import com.questbase.backend.quest.dto.CreateQuestRequest;
import com.questbase.backend.quest.dto.QuestNpcResponse;
import com.questbase.backend.quest.dto.QuestResponse;
import com.questbase.backend.relationship.questnpc.QuestNpc;
import com.questbase.backend.relationship.questnpc.QuestNpcRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestService {

    private final AuthService authService;
    private final CampaignAccessService campaignAccessService;
    private final CampaignRepository campaignRepository;
    private final QuestRepository questRepository;
    private final QuestNpcRepository questNpcRepository;

    public QuestService(
        AuthService authService,
        CampaignAccessService campaignAccessService,
        CampaignRepository campaignRepository,
        QuestRepository questRepository,
        QuestNpcRepository questNpcRepository
    ) {
        this.authService = authService;
        this.campaignAccessService = campaignAccessService;
        this.campaignRepository = campaignRepository;
        this.questRepository = questRepository;
        this.questNpcRepository = questNpcRepository;
    }

    public QuestResponse getQuestById(Long id) {
        User currentUser = authService.getCurrentUser();

        Quest quest = questRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Quest"));

        campaignAccessService.requireAccess(
            quest.getCampaign().getId(),
            currentUser.getId()
        );

        return toResponse(quest);
    }

    public List<QuestResponse> getAllQuests() {
        User currentUser = authService.getCurrentUser();

        List<Quest> quests = questRepository.findByCampaignUser(currentUser);

        return quests.stream()
            .map(quest -> toResponse(quest))
            .toList();
    }

    public QuestResponse createQuest(CreateQuestRequest request) {
        User currentUser = authService.getCurrentUser();

        Campaign campaign = campaignRepository.findByIdAndUser(request.campaignId(), currentUser)
            .orElseThrow(() -> new RuntimeException("Campaign not found"));

        Quest quest = Quest.builder()
            .title(request.title())
            .description(request.description())
            .status(request.status())
            .difficulty(request.difficulty())
            .rewardXp(request.rewardXp())
            .campaign(campaign)
            .build();

        Quest savedQuest = questRepository.save(quest);
        return toResponse(savedQuest);
    }

    public QuestResponse updateQuest(
        Long id,
        CreateQuestRequest request
    ) {
        User currentUser = authService.getCurrentUser();

        Quest quest = questRepository.findByIdAndCampaignUser(id, currentUser)
            .orElseThrow(() -> new RuntimeException("Quest not found"));

        Campaign campaign = campaignRepository.findByIdAndUser(request.campaignId(), currentUser)
            .orElseThrow(() -> new RuntimeException("Campaign not found"));

        quest.setTitle(request.title());
        quest.setDescription(request.description());
        quest.setStatus(request.status());
        quest.setDifficulty(request.difficulty());
        quest.setRewardXp(request.rewardXp());
        quest.setCampaign(campaign);

        Quest savedQuest = questRepository.save(quest);
        return toResponse(savedQuest);
    }

    public QuestResponse patchQuest(
        Long id,
        CreateQuestRequest request
    ) {
        User currentUser = authService.getCurrentUser();

        Quest quest = questRepository.findByIdAndCampaignUser(id, currentUser)
            .orElseThrow(() -> new RuntimeException("Quest not found"));

        if (request.campaignId() != null) {
            Campaign campaign = campaignRepository.findByIdAndUser(request.campaignId(), currentUser)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));
            quest.setCampaign(campaign);
        }

        if (request.title() != null) {
            quest.setTitle(request.title());
        }

        if (request.description() != null) {
            quest.setDescription(request.description());
        }

        if (request.status() != null) {
            quest.setStatus(request.status());
        }

        if (request.difficulty() != null) {
            quest.setDifficulty(request.difficulty());
        }

        if (request.rewardXp() != null) {
            quest.setRewardXp(request.rewardXp());
        }

        Quest savedQuest = questRepository.save(quest);
        return toResponse(savedQuest);
    }

    public void deleteQuest(Long id) {
        User currentUser = authService.getCurrentUser();

        Quest quest = questRepository.findByIdAndCampaignUser(id, currentUser)
            .orElseThrow(() -> new RuntimeException("Quest not found"));

        questRepository.delete(quest);
    }

    public List<QuestResponse> getQuestsByCampaignId(
        Long campaignId,
        String sort
    ) {
        User currentUser = authService.getCurrentUser();

        campaignAccessService.requireAccess(
            campaignId,
            currentUser.getId()
        );

        List<Quest> quests;
        if ("asc".equalsIgnoreCase(sort)) {
            quests = questRepository
                .findByCampaignIdOrderByCreatedAtAsc(campaignId);
        } else {
            quests = questRepository
                .findByCampaignIdOrderByCreatedAtDesc(campaignId);
        }

        return quests.stream()
            .map(quest -> toResponse(quest))
            .toList();
    }

    public QuestResponse saveQuestNotesById(
        Long id,
        String notes
    ) {
        User currentUser = authService.getCurrentUser();

        Quest quest = questRepository
            .findByIdAndCampaignUser(id, currentUser)
            .orElseThrow(() -> new RuntimeException("Quest not found"));

        quest.setNotes(notes);

        Quest savedQuest = questRepository.save(quest);

        return toResponse(savedQuest);
    }

    // =========================================================================
    // RELATIONSHIPS
    // =========================================================================

    public List<QuestNpcResponse> getNpcsByQuestId(
        Long questId
    ) {
        User currentUser = authService.getCurrentUser();

        Quest quest = questRepository.findById(questId)
            .orElseThrow(() -> new ResourceNotFoundException("Quest"));

        campaignAccessService.requireAccess(
            quest.getCampaign().getId(),
            currentUser.getId()
        );

        List<QuestNpc> questNpcs = questNpcRepository.findByQuestId(questId);

        return questNpcs.stream()
            .map(QuestNpcResponse::from)
            .toList();
    }

    // =========================================================================
    // HELPER FUNCTIONS
    // =========================================================================

    private QuestResponse toResponse(Quest quest) {
        return QuestResponse.builder()
            .id(quest.getId())
            .title(quest.getTitle())
            .description(quest.getDescription())
            .status(quest.getStatus())
            .difficulty(quest.getDifficulty())
            .rewardXp(quest.getRewardXp())
            .createdAt(quest.getCreatedAt())
            .notes(quest.getNotes())
            .build();
    }
}
