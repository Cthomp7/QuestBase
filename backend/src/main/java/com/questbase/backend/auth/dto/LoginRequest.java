package com.questbase.backend.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(

    @Size(max = 255)
    @NotBlank
    String email,

    @Size(max = 255)
    @NotBlank
    String password 
) {}
