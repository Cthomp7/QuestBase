package com.questbase.backend.controller;

import com.questbase.backend.service.AuthService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.questbase.backend.dto.LoginRequest;
import com.questbase.backend.dto.LoginResponse;
import com.questbase.backend.dto.RegisterRequest;
import com.questbase.backend.dto.UserResponse;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    private final AuthService authService;

    AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public UserResponse register(
        @Valid @RequestBody RegisterRequest request
    ) {
        return authService.register(request);
    }
    
    @PostMapping("/login")
    public LoginResponse login(
        @Valid @RequestBody LoginRequest request
    ) {
        return authService.login(request);
    }
    
}
