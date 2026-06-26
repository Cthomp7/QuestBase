package com.questbase.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.questbase.backend.entity.Campaign;

public interface CampaignRepository extends JpaRepository<Campaign, Long> {
  
}
