package com.questbase.backend.contact;

import jakarta.validation.constraints.NotBlank;

public record ContactRequest (
    String name,
    String email,
    @NotBlank String message
) {}
