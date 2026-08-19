package com.questbase.backend.relationship.campaignInvite;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.questbase.backend.relationship.campaignInvite.enums.CampaignInviteStatus;

public interface CampaignInviteRepository extends JpaRepository<CampaignInvite, Long> {
    List<CampaignInvite> findByCampaignId(Long campaignId);

    Optional<CampaignInvite> findByTokenHash(String tokenHash);

    boolean existsByCampaignIdAndEmailAndStatus(
        Long campaignId,
        String email,
        CampaignInviteStatus status
    );
}
