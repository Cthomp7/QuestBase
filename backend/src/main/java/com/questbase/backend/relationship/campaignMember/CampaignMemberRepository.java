package com.questbase.backend.relationship.campaignMember;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CampaignMemberRepository extends JpaRepository<CampaignMember, Long>{
    List<CampaignMember> findByCampaignId(Long campaignId);

    Optional<CampaignMember> findByCampaignIdAndUserId(Long campaignId, Long userId);

    List<CampaignMember> findByCampaignIdAndCampaignUserId(
        Long campaignId, 
        Long campaignUserId
    );

    boolean existsByCampaignIdAndUserId(
        Long campaignId,
        Long userId
    );
}
