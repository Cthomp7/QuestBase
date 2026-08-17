package com.questbase.backend.auth.dto;

import java.time.LocalDateTime;

import com.questbase.backend.auth.User;

import lombok.Builder;

@Builder
public record UserResponse(
    Long id,
    String displayName,
    String email,
    LocalDateTime createdAt
) {
    public static UserResponse from(User user) {
        return new UserResponse(
            user.getId(),
            user.getDisplayName(),
            user.getEmail(),
            user.getCreatedAt()
        );
    }
}
