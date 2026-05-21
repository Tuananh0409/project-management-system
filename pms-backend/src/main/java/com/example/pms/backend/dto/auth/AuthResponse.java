package com.example.pms.backend.dto.auth;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class AuthResponse {

    Long id;
    String email;
    String username;
    String status;
    String accessToken;
    String tokenType;
    Long expiresInSeconds;
}
