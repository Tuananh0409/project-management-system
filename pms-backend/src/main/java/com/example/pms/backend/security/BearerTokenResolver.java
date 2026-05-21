package com.example.pms.backend.security;

import org.springframework.http.HttpHeaders;

public final class BearerTokenResolver {

    private BearerTokenResolver() {}

    public static String resolve(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return null;
        }
        String token = authorizationHeader.substring(7).trim();
        return token.isEmpty() ? null : token;
    }

    public static String resolveFromHeaderValue(String headerName, String headerValue) {
        if (!HttpHeaders.AUTHORIZATION.equalsIgnoreCase(headerName)) {
            return null;
        }
        return resolve(headerValue);
    }
}
