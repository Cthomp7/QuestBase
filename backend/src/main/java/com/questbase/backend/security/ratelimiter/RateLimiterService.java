package com.questbase.backend.security.ratelimiter;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class RateLimiterService {

    private final Map<String, RequestBucket> buckets = new ConcurrentHashMap<>();

    public boolean isAllowed(String key, int maxRequests, Duration window) {
        long now = System.currentTimeMillis();

        RequestBucket bucket = buckets.compute(key, (ignored, existing) -> {
            if (existing == null || now >= existing.expiresAt()) {
                return new RequestBucket(1, now + window.toMillis());
            }

            return new RequestBucket(
                existing.requestCount() + 1,
                existing.expiresAt()
            );
        });

        return bucket.requestCount() <= maxRequests;
    }

    private record RequestBucket(
        int requestCount,
        long expiresAt
    ) {}

    @Scheduled(fixedRate = 600_000) // every 10 minutes
    public void cleanup() {
        long now = System.currentTimeMillis();

        buckets.entrySet().removeIf(entry ->
            now >= entry.getValue().expiresAt()
        );
    }
}
