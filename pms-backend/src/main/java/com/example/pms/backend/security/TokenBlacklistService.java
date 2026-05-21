package com.example.pms.backend.security;

import java.time.Instant;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

/**
 * Blacklist JWT đã logout (in-memory, phù hợp dev / single instance).
 * Production nhiều node: chuyển sang Redis.
 */
@Service
public class TokenBlacklistService {

    private final Map<String, Instant> revoked = new ConcurrentHashMap<>();

    public void revoke(String jti, Instant expiresAt) {
        if (jti != null && expiresAt != null) {
            revoked.put(jti, expiresAt);
        }
    }

    public boolean isRevoked(String jti) {
        if (jti == null) {
            return false;
        }
        Instant exp = revoked.get(jti);
        if (exp == null) {
            return false;
        }
        if (exp.isBefore(Instant.now())) {
            revoked.remove(jti);
            return false;
        }
        return true;
    }

    @Scheduled(fixedRate = 300_000)
    void purgeExpired() {
        Instant now = Instant.now();
        Iterator<Map.Entry<String, Instant>> it = revoked.entrySet().iterator();
        while (it.hasNext()) {
            if (it.next().getValue().isBefore(now)) {
                it.remove();
            }
        }
    }
}
