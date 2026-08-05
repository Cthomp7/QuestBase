package com.questbase.backend.contact;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.questbase.backend.contact.dto.ContactRequest;

@Service
public class ContactEmailService {
    private final JavaMailSender mailSender;
    private final String recipientEmail;
    private final String senderEmail;

    public ContactEmailService(
        JavaMailSender mailSender,
        @Value("${contact.recipient}") String recipientEmail,
        @Value("${contact.sender}") String senderEmail
    ) {
        this.mailSender = mailSender;
        this.recipientEmail = recipientEmail;
        this.senderEmail = senderEmail;
    }

    public void sendContactEmail(ContactRequest request) {
        SimpleMailMessage email = new SimpleMailMessage();

        String name = request.name();
        if (name == null || name.isBlank()) {
            name = "(No Name Provided)";
        }
        String emailAddress = request.email();
        if (emailAddress == null || emailAddress.isBlank()) {
            emailAddress = "(No Email Provided)";
        }

        email.setFrom(senderEmail);
        email.setTo(recipientEmail);
        email.setSubject("[QuestBase] Contact Us Message");

        email.setText("""
            Name: %s
            Email: %s

            Message:
            %s
            """.formatted(
                name,
                emailAddress,
                request.message()
            ));

        mailSender.send(email);
    }
}
