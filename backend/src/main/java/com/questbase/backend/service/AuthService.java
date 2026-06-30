package com.questbase.backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.questbase.backend.dto.LoginRequest;
import com.questbase.backend.dto.LoginResponse;
import com.questbase.backend.dto.RegisterRequest;
import com.questbase.backend.dto.UserResponse;
import com.questbase.backend.entity.User;
import com.questbase.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email already exists.");
        }

        String hashedPassword = passwordEncoder.encode(request.password());

        User user = User.builder()
            .displayName(request.displayName())
            .email(request.email())
            .password(hashedPassword)
            .build();

        User savedUser = userRepository.save(user);

        return UserResponse.builder()
            .id(savedUser.getId())
            .displayName(savedUser.getDisplayName())
            .email(savedUser.getEmail())
            .build();
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtService.generateToken(user);

        return new LoginResponse(token);
    }
}
