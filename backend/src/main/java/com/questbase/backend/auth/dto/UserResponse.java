package com.questbase.backend.auth.dto;

import java.time.LocalDateTime;

import lombok.Builder;

@Builder
public record UserResponse(
    Long id,
    String displayName,
    String email,
    LocalDateTime createdAt
) {}
