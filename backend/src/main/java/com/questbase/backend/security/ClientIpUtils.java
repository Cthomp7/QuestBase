package com.questbase.backend.security;

import jakarta.servlet.http.HttpServletRequest;

public class ClientIpUtils {
    private ClientIpUtils() {}

    public static String getClientIp(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");

        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }

        return request.getRemoteAddr();
    }
}
