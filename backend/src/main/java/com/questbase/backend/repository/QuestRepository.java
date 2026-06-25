package com.questbase.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.questbase.backend.entity.Quest;

public interface QuestRepository extends JpaRepository<Quest, Long> {
  
}
