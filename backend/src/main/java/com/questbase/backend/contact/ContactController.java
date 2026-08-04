package com.questbase.backend.contact;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/contact")
public class ContactController {
    private final ContactEmailService contactEmailService;

    public ContactController(ContactEmailService contactEmailService) {
        this.contactEmailService = contactEmailService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> sendContactMessage(
        @Valid @RequestBody ContactRequest request
    ) {
        contactEmailService.sendContactEmail(request);

        return ResponseEntity.ok(
            Map.of("message", "Your message was sent successfully.")
        );
    }
}
