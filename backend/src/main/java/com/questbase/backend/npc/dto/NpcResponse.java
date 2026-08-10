package com.questbase.backend.npc.dto;

import java.time.LocalDateTime;

import com.questbase.backend.npc.enums.NpcRole;
import com.questbase.backend.npc.enums.NpcStatus;

import lombok.Builder;

@Builder
public record NpcResponse (
    Long id,
    String name,
    String description,
    Integer level,
    NpcStatus status,
    NpcRole role,
    String race,
    String occupation,
    String personality,
    String appearance,
    String notes,
    LocalDateTime createdAt
) {}
