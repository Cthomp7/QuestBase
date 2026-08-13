package com.questbase.backend.relationship.questnpc;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestNpcRepository extends JpaRepository<QuestNpc, Long> {
    List<QuestNpc> findByQuestId(Long questId);

    Optional<QuestNpc> findById(Long questId);

    List<QuestNpc> findByNpcIdAndNpcCampaignUserId(Long npcId, Long userId);

    List<QuestNpc> findByQuestIdAndNpcCampaignUserId(Long questId, Long userId);

}