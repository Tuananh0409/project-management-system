package com.example.pms.backend.security;

import com.example.pms.backend.config.JwtProperties;
import com.example.pms.backend.dto.auth.AuthResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import java.time.Duration;
import java.util.Optional;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class AuthCookieService {

    public static final String COOKIE_NAME = "pms_access_token";

    private final long accessTokenTtlSeconds;
    private final boolean cookieSecure;

    public AuthCookieService(JwtProperties properties) {
        this.accessTokenTtlSeconds = properties.accessTokenTtlHours() * 3600L;
        this.cookieSecure = properties.cookieSecure();
    }

    public ResponseEntity<AuthResponse> sessionResponse(AuthResponse withToken, HttpStatus status) {
        AuthResponse body = stripToken(withToken);
        if (withToken.getAccessToken() == null || withToken.getAccessToken().isBlank()) {
            return ResponseEntity.status(status).body(body);
        }
        ResponseCookie cookie = buildSessionCookie(withToken.getAccessToken());
        return ResponseEntity.status(status)
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(body);
    }

    public ResponseEntity<Void> logoutResponse() {
        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, clearSessionCookie().toString())
                .build();
    }

    public Optional<String> resolveToken(HttpServletRequest request) {
        Optional<String> fromCookie = resolveFromCookie(request);
        if (fromCookie.isPresent()) {
            return fromCookie;
        }
        return Optional.ofNullable(BearerTokenResolver.resolve(request.getHeader(HttpHeaders.AUTHORIZATION)));
    }

    private Optional<String> resolveFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return Optional.empty();
        }
        for (Cookie cookie : cookies) {
            if (COOKIE_NAME.equals(cookie.getName())) {
                String value = cookie.getValue();
                if (value != null && !value.isBlank()) {
                    return Optional.of(value.trim());
                }
            }
        }
        return Optional.empty();
    }

    private ResponseCookie buildSessionCookie(String token) {
        return ResponseCookie.from(COOKIE_NAME, token)
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/")
                .maxAge(Duration.ofSeconds(accessTokenTtlSeconds))
                .sameSite("Lax")
                .build();
    }

    private ResponseCookie clearSessionCookie() {
        return ResponseCookie.from(COOKIE_NAME, "")
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();
    }

    private AuthResponse stripToken(AuthResponse response) {
        return AuthResponse.builder()
                .id(response.getId())
                .email(response.getEmail())
                .username(response.getUsername())
                .status(response.getStatus())
                .build();
    }
}
