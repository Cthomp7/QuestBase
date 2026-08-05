package com.questbase.backend.contact.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record TurnstileResponse(
    boolean success,

    @JsonProperty("error-codes")
    List<String> errorCodes
) {}