package com.questbase.backend.auth;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.questbase.backend.auth.dto.LoginRequest;
import com.questbase.backend.auth.dto.RegisterRequest;
import com.questbase.backend.entity.User;
import com.questbase.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public String register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email already exists.");
        }

        String hashedPassword = passwordEncoder.encode(request.password());

        User user = User.builder()
            .displayName(request.displayName())
            .email(request.email())
            .password(hashedPassword)
            .build();

        userRepository.save(user);

        return jwtService.generateToken(user);
    }

    public String login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        return jwtService.generateToken(user);
    }

    public User getCurrentUser() {
        String email = SecurityContextHolder
            .getContext()
            .getAuthentication()
            .getName();

        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
