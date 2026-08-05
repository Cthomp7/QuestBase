package com.questbase.backend.contact.dto;

import jakarta.validation.constraints.NotBlank;

public record ContactRequest (
    String name,
    String email,
    @NotBlank String message,
    @NotBlank String turnstileToken
) {}
