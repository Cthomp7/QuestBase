package com.questbase.backend.security.turnstile;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

@Service
public class TurnstileService {

    private final RestClient restClient = RestClient.builder()
        .baseUrl("https://challenges.cloudflare.com")
        .build();

    private final String secret;

    public TurnstileService(
        @Value("${cloudflare.turnstile.secret}") String secret
    ) {
        this.secret = secret;
    }

    public boolean verify(String token, String clientIp) {
        if (token == null || token.isBlank()) {
            return false;
        }

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("secret", secret);
        body.add("response", token);

        if (clientIp != null && !clientIp.isBlank()) {
            body.add("remoteip", clientIp);
        }

        try {
            TurnstileResponse response = restClient.post()
                .uri("/turnstile/v0/siteverify")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(body)
                .retrieve()
                .body(TurnstileResponse.class);

            return response != null && response.success();
        } catch (Exception exception) {
            System.err.println(
                "Turnstile verification failed: " + exception.getMessage()
            );

            return false;
        }
    }
}