package com.questbase.backend.service;

import com.questbase.backend.dto.CreateQuestRequest;
import com.questbase.backend.dto.QuestResponse;
import com.questbase.backend.entity.Campaign;
import com.questbase.backend.entity.Quest;
import com.questbase.backend.repository.CampaignRepository;
import com.questbase.backend.repository.QuestRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestService {

    private final QuestRepository questRepository;
    private final CampaignRepository campaignRepository;

    public QuestService(
        QuestRepository questRepository,
        CampaignRepository campaignRepository
    ) {
        this.questRepository = questRepository;
        this.campaignRepository = campaignRepository;
    }

    public QuestResponse getQuestById(Long id) {
        Quest quest = questRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Quest not found"));

        return toResponse(quest);
    }

    public List<QuestResponse> getAllQuests() {
        List<Quest> quests = questRepository.findAll();

        return quests.stream()
            .map(quest -> toResponse(quest))
            .toList();
    }

    public QuestResponse createQuest(CreateQuestRequest request) {
        Campaign campaign = campaignRepository.findById(request.campaignId())
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
        Quest quest = questRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Quest not found"));

        Campaign campaign = campaignRepository.findById(request.campaignId())
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
        Quest quest = questRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Quest not found"));

        if (request.campaignId() != null) {
            Campaign campaign = campaignRepository.findById(request.campaignId())
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
        questRepository.deleteById(id);
    }

    // =========================================================================
    // HELPER FUNCTIONS
    // =========================================================================

    private QuestResponse toResponse(Quest quest) {
        return QuestResponse.builder()
            .title(quest.getTitle())
            .description(quest.getDescription())
            .status(quest.getStatus())
            .difficulty(quest.getDifficulty())
            .rewardXp(quest.getRewardXp())
            .createdAt(quest.getCreatedAt())
            .campaign(quest.getCampaign())
            .build();
    }
}
