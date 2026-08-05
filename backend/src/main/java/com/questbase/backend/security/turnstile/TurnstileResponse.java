package com.questbase.backend.security.turnstile;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record TurnstileResponse(
    boolean success,

    @JsonProperty("error-codes")
    List<String> errorCodes
) {}