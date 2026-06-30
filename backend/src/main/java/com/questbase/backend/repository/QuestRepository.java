package com.questbase.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.questbase.backend.entity.Quest;
import com.questbase.backend.entity.User;

public interface QuestRepository extends JpaRepository<Quest, Long> {
    List<Quest> findByUser(User user);

    Optional<Quest> findByIdAndUser(Long id, User user);
}
