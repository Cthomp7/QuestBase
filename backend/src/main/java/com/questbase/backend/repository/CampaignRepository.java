package com.questbase.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.questbase.backend.entity.Campaign;
import com.questbase.backend.entity.User;

public interface CampaignRepository extends JpaRepository<Campaign, Long> {
    List<Campaign> findByUser(User user);

    Optional<Campaign> findByIdAndUser(Long id, User user);
}
