package com.questbase.backend.quest;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.questbase.backend.auth.User;

public interface QuestRepository extends JpaRepository<Quest, Long> {
    List<Quest> findByCampaignUser(User user);

    Optional<Quest> findByIdAndCampaignUser(Long id, User user);

    Boolean existsByIdAndCampaignUserId(Long questId, Long userId);

    List<Quest> findByCampaignIdAndCampaignUserId(
        Long campaignId,
        Long userId
    );

    List<Quest> findByCampaignIdAndCampaignUserIdOrderByCreatedAtAsc(
        Long campaignId,
        Long userId
    );

    List<Quest> findByCampaignIdAndCampaignUserIdOrderByCreatedAtDesc(
        Long campaignId,
        Long userId
    );
}
