package com.questbase.backend.security.secureToken;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.HexFormat;

import org.springframework.stereotype.Service;

@Service
public class SecureTokenService {
    private final SecureRandom secureRandom = new SecureRandom();

    public String generateToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);

        return Base64.getUrlEncoder()
            .withoutPadding()
            .encodeToString(bytes);
    }

    public String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            byte[] hash = digest.digest(
                token.getBytes(StandardCharsets.UTF_8)
            );

            return HexFormat.of().formatHex(hash);

        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(
                "SHA-256 algorithm unavailable",
                e
            );
        }
    }
}
