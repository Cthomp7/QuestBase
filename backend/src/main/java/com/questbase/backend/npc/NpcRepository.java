package com.questbase.backend.npc;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.questbase.backend.auth.User;

public interface NpcRepository extends JpaRepository<Npc, Long> {
    List<Npc> findByCampaignUser(User user);

    Optional<Npc> findByIdAndCampaignUser(Long id, User user);

    Boolean existsByIdAndCampaignUserId(Long npcId, Long userId);

    List<Npc> findByCampaignIdOrderByCreatedAtAsc(Long campaignId);

    List<Npc> findByCampaignIdOrderByCreatedAtDesc(Long campaignId);
}
