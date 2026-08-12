package com.questbase.backend.relationship.questnpc.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateQuestNpcRequest(

    @NotNull(message = "A quest ID is required.")
    @Positive
    Long questId,

    @NotNull(message = "An NPC ID is required.")
    @Positive
    Long npcId,

    String role,

    String notes
) {}
