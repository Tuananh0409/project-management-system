package com.example.pms.backend.security;

public record JwtTokenPayload(String jti, Long userId, String email, String username) {}
