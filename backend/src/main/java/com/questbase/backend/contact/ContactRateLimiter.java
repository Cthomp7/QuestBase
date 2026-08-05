package com.questbase.backend.contact;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

@Service
public class ContactRateLimiter {

    private static final int MAX_REQUESTS = 3;
    private static final Duration WINDOW = Duration.ofMinutes(10);

    private final Map<String, Deque<Instant>> requestsByIp =
        new ConcurrentHashMap<>();

    public boolean allowRequest(String ipAddress) {
        String key = ipAddress == null || ipAddress.isBlank()
            ? "unknown"
            : ipAddress;

        Instant now = Instant.now();
        Instant cutoff = now.minus(WINDOW);

        Deque<Instant> requests = requestsByIp.computeIfAbsent(
            key,
            ignored -> new ArrayDeque<>()
        );

        synchronized (requests) {
            while (
                !requests.isEmpty()
                && requests.peekFirst().isBefore(cutoff)
            ) {
                requests.removeFirst();
            }

            if (requests.size() >= MAX_REQUESTS) {
                return false;
            }

            requests.addLast(now);
            return true;
        }
    }
}
