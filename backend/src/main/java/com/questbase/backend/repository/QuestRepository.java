package com.questbase.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.questbase.backend.entity.Quest;
import com.questbase.backend.entity.User;

public interface QuestRepository extends JpaRepository<Quest, Long> {
    List<Quest> findByCampaignUser(User user);

    Optional<Quest> findByIdAndCampaignUser(Long id, User user);
}
