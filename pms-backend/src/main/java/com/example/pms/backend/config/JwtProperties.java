package com.example.pms.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.jwt")
public record JwtProperties(String secret, int accessTokenTtlHours, boolean cookieSecure) {}
