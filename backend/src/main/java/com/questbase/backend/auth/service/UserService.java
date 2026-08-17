package com.questbase.backend.auth.service;

import com.questbase.backend.auth.UserRepository;
import org.springframework.stereotype.Service;

import com.questbase.backend.auth.User;
import com.questbase.backend.auth.dto.UpdateAccountRequest;
import com.questbase.backend.auth.dto.UserResponse;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final AuthService authService;

    public UserService(
        AuthService authService, UserRepository userRepository
    ) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    public UserResponse updateAccount(UpdateAccountRequest request) {
        User currentUser = authService.getCurrentUser();

        currentUser.setDisplayName(request.displayName());

        return UserResponse.from(userRepository.save(currentUser));
    }
}
