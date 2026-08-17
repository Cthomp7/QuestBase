package com.questbase.backend.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest (
    @NotBlank(message = "Current password is required.")
    @Size(min = 8, max = 255, message = "Password must be between 8 and 255 characters.")
    String currentPassword,

    @NotBlank(message = "A new password is required.")
    @Size(min = 8, max = 255, message = "Password must be between 8 and 255 characters.")
    String newPassword
) {}
