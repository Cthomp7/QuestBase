package com.questbase.backend.email;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.questbase.backend.exception.EmailSendException;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
    private final JavaMailSender mailSender;
    private final String senderEmail;

    public EmailService(
        JavaMailSender mailSender,
        @Value("${contact.sender}") String senderEmail
    ) {
        this.mailSender = mailSender;
        this.senderEmail = senderEmail;
    }

    public void sendCampaignInvite(
        String recipientEmail,
        String campaignName,
        String token
    ) {
        try {
            String inviteUrl =
                "https://questbase.net/invite/" + token;

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(senderEmail);
            helper.setTo(recipientEmail);
            helper.setSubject("You've been invited to join a QuestBase campaign!");

            String html = """
                <h2>You've been summoned!</h2>

                <p>You’ve been invited to join %s on QuestBase.</p>

                <p>Accept the invitation to join the campaign and view the quests, characters, and other campaign materials your Game Master has shared with you.</p>

                <p>
                    <a href="%s">Join the Campaign</a>
                </p>

                <p>This invitation expires in 7 days.</p>

                <p>If you weren’t expecting this invitation, you can safely ignore this email.<p>
                """.formatted(
                    campaignName,
                    inviteUrl
                );

            helper.setText(html, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new EmailSendException("Failed to send campaign invitation email.", e);
        }
    }
}
