package com.questbase.backend.contact;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.questbase.backend.contact.dto.ContactRequest;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/contact")
public class ContactController {
    private final ContactEmailService contactEmailService;
    private final TurnstileService turnstileService;

    public ContactController(
        ContactEmailService contactEmailService, 
        TurnstileService turnstileService
    ) {
        this.contactEmailService = contactEmailService;
        this.turnstileService = turnstileService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> sendContactMessage(
        @Valid @RequestBody ContactRequest request,
        HttpServletRequest servletRequest
    ) {
        String clientIp = getClientIp(servletRequest);

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

        contactEmailService.sendContactEmail(request);

        return ResponseEntity.ok(
            Map.of("message", "Your message was sent successfully.")
        );
    }

    private String getClientIp(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");

        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }

        return request.getRemoteAddr();
    }
}
