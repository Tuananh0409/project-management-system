package com.example.pms.backend.security;

import com.example.pms.backend.config.JwtProperties;
import com.example.pms.backend.entity.User;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.stereotype.Service;

/**
 * JWT HS256 — chỉ dùng JDK + Jackson (không cần thư viện jjwt, tránh lỗi SSL Maven trên mạng công ty).
 */
@Service
public class JwtService {

    private static final String ALGORITHM = "HmacSHA256";

    private final byte[] secretBytes;
    private final long accessTokenTtlSeconds;
    private final ObjectMapper objectMapper;

    public JwtService(JwtProperties properties, ObjectMapper objectMapper) {
        this.secretBytes = properties.secret().getBytes(StandardCharsets.UTF_8);
        if (secretBytes.length < 32) {
            throw new IllegalStateException("app.jwt.secret phải có ít nhất 32 ký tự (HS256)");
        }
        this.accessTokenTtlSeconds = properties.accessTokenTtlHours() * 3600L;
        this.objectMapper = objectMapper;
    }

    public IssuedToken issueAccessToken(User user) {
        try {
            String jti = UUID.randomUUID().toString();
            Instant now = Instant.now();
            Instant expiresAt = now.plusSeconds(accessTokenTtlSeconds);
            long iat = now.getEpochSecond();
            long exp = expiresAt.getEpochSecond();

            Map<String, Object> header = Map.of("alg", "HS256", "typ", "JWT");
            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("sub", String.valueOf(user.getId()));
            payload.put("email", user.getEmail());
            payload.put("username", user.getUsername());
            payload.put("jti", jti);
            payload.put("iat", iat);
            payload.put("exp", exp);

            String token = compact(header, payload);
            return new IssuedToken(token, jti, accessTokenTtlSeconds, expiresAt);
        } catch (Exception ex) {
            throw new JwtException("Không tạo được token", ex);
        }
    }

    public JwtTokenPayload parseAndValidate(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                throw new JwtException("Token không hợp lệ");
            }
            String signed = parts[0] + "." + parts[1];
            byte[] expectedSig = base64UrlDecode(parts[2]);
            byte[] actualSig = sign(signed);
            if (!constantTimeEquals(expectedSig, actualSig)) {
                throw new JwtException("Chữ ký token không hợp lệ");
            }

            Map<String, Object> claims =
                    objectMapper.readValue(base64UrlDecode(parts[1]), new TypeReference<>() {});

            String jti = stringClaim(claims, "jti");
            String sub = stringClaim(claims, "sub");
            String email = stringClaim(claims, "email");
            String username = stringClaim(claims, "username");
            long exp = longClaim(claims, "exp");

            if (Instant.now().getEpochSecond() >= exp) {
                throw new JwtException("Token đã hết hạn");
            }

            return new JwtTokenPayload(jti, Long.parseLong(sub), email, username);
        } catch (JwtException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new JwtException("Token không hợp lệ", ex);
        }
    }

    public Instant getExpiration(String token) {
        try {
            String[] parts = token.split("\\.");
            Map<String, Object> claims =
                    objectMapper.readValue(base64UrlDecode(parts[1]), new TypeReference<>() {});
            return Instant.ofEpochSecond(longClaim(claims, "exp"));
        } catch (Exception ex) {
            throw new JwtException("Token không hợp lệ", ex);
        }
    }

    private String compact(Map<String, Object> header, Map<String, Object> payload) throws Exception {
        String headerPart = base64UrlEncode(objectMapper.writeValueAsBytes(header));
        String payloadPart = base64UrlEncode(objectMapper.writeValueAsBytes(payload));
        String signed = headerPart + "." + payloadPart;
        String signaturePart = base64UrlEncode(sign(signed));
        return signed + "." + signaturePart;
    }

    private byte[] sign(String data) throws Exception {
        Mac mac = Mac.getInstance(ALGORITHM);
        mac.init(new SecretKeySpec(secretBytes, ALGORITHM));
        return mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
    }

    private static String base64UrlEncode(byte[] data) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(data);
    }

    private static byte[] base64UrlDecode(String value) {
        return Base64.getUrlDecoder().decode(value);
    }

    private static String stringClaim(Map<String, Object> claims, String key) {
        Object v = claims.get(key);
        if (v == null) {
            throw new JwtException("Thiếu claim: " + key);
        }
        return String.valueOf(v);
    }

    private static long longClaim(Map<String, Object> claims, String key) {
        Object v = claims.get(key);
        if (v instanceof Number number) {
            return number.longValue();
        }
        throw new JwtException("Thiếu claim: " + key);
    }

    private static boolean constantTimeEquals(byte[] a, byte[] b) {
        if (a.length != b.length) {
            return false;
        }
        int result = 0;
        for (int i = 0; i < a.length; i++) {
            result |= a[i] ^ b[i];
        }
        return result == 0;
    }

    public record IssuedToken(String token, String jti, long expiresInSeconds, Instant expiresAt) {}
}
