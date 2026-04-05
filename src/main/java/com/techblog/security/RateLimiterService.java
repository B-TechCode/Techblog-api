package com.techblog.security;

import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimiterService {

    private final ConcurrentHashMap<String, Integer> attempts = new ConcurrentHashMap<>();
    private final int MAX_ATTEMPTS = 5;

    // ✅ Check if blocked
    public boolean isBlocked(String key) {
        return attempts.getOrDefault(key, 0) >= MAX_ATTEMPTS;
    }

    // ✅ Record failed attempt
    public void recordFailedAttempt(String key) {
        attempts.put(key, attempts.getOrDefault(key, 0) + 1);
    }

    // ✅ Reset after success
    public void resetAttempts(String key) {
        attempts.remove(key);
    }
}