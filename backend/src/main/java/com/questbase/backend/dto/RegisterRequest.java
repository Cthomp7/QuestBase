package com.questbase.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(

    @Size(max = 100)
    @NotBlank
    String displayName,

    @Size(max = 255)
    @NotBlank
    String email,

    @Size(max = 255)
    @NotBlank
    String password 
) {}
