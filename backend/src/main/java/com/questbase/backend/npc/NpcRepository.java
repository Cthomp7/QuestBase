package com.questbase.backend.npc;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.questbase.backend.auth.User;

public interface NpcRepository extends JpaRepository<Npc, Long> {
    List<Npc> findByCampaignUser(User user);

    List<Npc> findByCampaignIdAndCampaignUserIdOrderByCreatedAtAsc(
        Long campaignId,
        Long userId
    );

    List<Npc> findByCampaignIdAndCampaignUserIdOrderByCreatedAtDesc(
        Long campaignId,
        Long userId
    );
}
