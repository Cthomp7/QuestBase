package com.questbase.backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(

    @NotBlank(message = "A name is required.")
    @Size(max = 100)
    String displayName,

    @NotBlank(message = "A email address is required.")
    @Email(message = "Please enter a valid email address.")
    @Size(max = 255, message = "Email must be less than 255 characters.")
    String email,

    @NotBlank(message = "A password is required.")
    @Size(min = 8, max = 255, message = "Password must be between 8 and 255 characters.")
    String password,

    @NotBlank(message = "Turnstile token is required.")
    String turnstileToken
) {}
