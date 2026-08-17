package com.questbase.backend.auth;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.questbase.backend.auth.dto.ChangePasswordRequest;
import com.questbase.backend.auth.dto.CustomUserDetails;
import com.questbase.backend.auth.dto.LoginRequest;
import com.questbase.backend.auth.dto.RegisterRequest;
import com.questbase.backend.auth.dto.UpdateAccountRequest;
import com.questbase.backend.auth.dto.UserResponse;
import com.questbase.backend.auth.service.AuthService;
import com.questbase.backend.auth.service.UserService;
import com.questbase.backend.security.ClientIpUtils;
import com.questbase.backend.security.ratelimiter.RateLimiterService;
import com.questbase.backend.security.turnstile.TurnstileService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import java.time.Duration;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Value("${app.cookie.secure}")
    private boolean secureCookie;
    
    private final AuthService authService;
    private final TurnstileService turnstileService;
    private final RateLimiterService rateLimiter;
    private final UserService userService;

    AuthController(
        AuthService authService,
        RateLimiterService rateLimiter,
        TurnstileService turnstileService,
        UserService userService
    ) {
        this.authService = authService;
        this.rateLimiter = rateLimiter;
        this.turnstileService = turnstileService;
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();

        return ResponseEntity.ok(
            UserResponse.builder()
                .id(user.getId())
                .email(user.getUsername())
                .displayName(user.getDisplayName())
                .createdAt(user.getCreatedAt())
                .build()
        );
    }

    @PatchMapping("/me")
    public UserResponse updateAccount(
        @Valid @RequestBody UpdateAccountRequest request
    ) {
        return userService.updateAccount(request);
    }

    private ResponseEntity<Void> generateHTTPCookie(String token) {
        ResponseCookie cookie = ResponseCookie.from("jwt", token)
            .httpOnly(true)
            .secure(secureCookie)
            .path("/")
            .maxAge(Duration.ofDays(1))
            .sameSite("Lax")
            .build();

        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, cookie.toString())
            .build();
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
        @Valid @RequestBody RegisterRequest request,
        HttpServletRequest servletRequest
    ) {
        String clientIp = ClientIpUtils.getClientIp(servletRequest);

        boolean allowed = rateLimiter.isAllowed(
            "register:" + clientIp,
            3,
            Duration.ofMinutes(10)
        );

        if (!allowed) {
            return ResponseEntity
                .status(HttpStatus.TOO_MANY_REQUESTS)
                .body(Map.of(
                    "message",
                    "Too many registration attempts. Please try again in 10 minutes."
                ));
        }

        boolean validTurnstile = turnstileService.verify(
            request.turnstileToken(),
            clientIp
        );

        if (!validTurnstile) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                    "message",
                    "The security check could not be verified."
                ));
        }

        String token = authService.register(request);

        return generateHTTPCookie(token);
    }
    
    @PostMapping("/login")
    public ResponseEntity<Void> login(
        @Valid @RequestBody LoginRequest request
    ) {
        String token = authService.login(request);

        return generateHTTPCookie(token);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {

        ResponseCookie cookie = ResponseCookie.from("jwt", "")
            .httpOnly(true)
            .secure(secureCookie)
            .sameSite("Lax")
            .path("/")
            .maxAge(0)
            .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok().build();
    }

    @PatchMapping("/password")
    public void changePassword(
        @Valid @RequestBody ChangePasswordRequest request
    ) {
        userService.changePassword(request);
    }
}
