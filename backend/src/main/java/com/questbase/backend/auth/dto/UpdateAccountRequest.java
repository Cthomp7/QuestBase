package com.questbase.backend.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateAccountRequest (
    @NotBlank(message = "Your name can not be blank.")
    @Size(min = 1, max = 100)
    String displayName 
) {}
