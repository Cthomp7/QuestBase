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

    public List<QuestResponse> getAllQuests() {
        List<Quest> quests = questRepository.findAll();

        return quests.stream()
            .map(quest -> toResponse(quest))
            .toList();
    }

    public QuestResponse createQuest(CreateQuestRequest request) {
        Campaign campaign = campaignRepository.findById(request.getCampaignId())
            .orElseThrow(() -> new RuntimeException("Campaign not found"));

        Quest quest = Quest.builder()
            .title(request.getTitle())
            .description(request.getDescription())
            .status(request.getStatus())
            .difficulty(request.getDifficulty())
            .rewardXp(request.getRewardXp())
            .campaign(campaign)
            .build();

        Quest savedQuest = questRepository.save(quest);

        return toResponse(savedQuest);
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
