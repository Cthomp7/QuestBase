package com.questbase.backend.auth.service;

import com.questbase.backend.auth.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.questbase.backend.auth.User;
import com.questbase.backend.auth.dto.ChangePasswordRequest;
import com.questbase.backend.auth.dto.UpdateAccountRequest;
import com.questbase.backend.auth.dto.UserResponse;
import com.questbase.backend.exception.auth.InvalidPasswordException;

@Service
public class UserService {
    private final AuthService authService;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public UserService(
        AuthService authService,
        PasswordEncoder passwordEncoder,
        UserRepository userRepository
    ) {
        this.authService = authService;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    public UserResponse updateAccount(UpdateAccountRequest request) {
        User currentUser = authService.getCurrentUser();

        currentUser.setDisplayName(request.displayName());

        return UserResponse.from(userRepository.save(currentUser));
    }

    public void changePassword(ChangePasswordRequest request) {
        User currentUser = authService.getCurrentUser();

        if (!passwordEncoder.matches(request.currentPassword(), currentUser.getPassword())) {
            throw new InvalidPasswordException();
        }

        String hashedPassword = passwordEncoder.encode(request.newPassword());

        currentUser.setPassword(hashedPassword);

        userRepository.save(currentUser);
    }
}
