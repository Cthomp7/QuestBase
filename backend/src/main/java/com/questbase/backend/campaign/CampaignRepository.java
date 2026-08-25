package com.questbase.backend.campaign;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.questbase.backend.auth.User;

public interface CampaignRepository extends JpaRepository<Campaign, Long> {
    List<Campaign> findByUser(User user);

    Optional<Campaign> findByIdAndUser(Long id, User user);

    boolean existsByIdAndUserId(Long campaignId, Long userId);

    @Query("""
        SELECT DISTINCT c
        FROM Campaign c
        LEFT JOIN CampaignMember cm ON cm.campaign = c
        WHERE c.user = :user
        OR cm.user = :user
    """)
    List<Campaign> findAllAccessibleByUser(
        @Param("user") User user
    );
}
