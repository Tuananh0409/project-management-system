package com.example.pms.backend.auth;

import com.example.pms.backend.entity.User;
import com.example.pms.backend.repository.UserRepository;
import com.example.pms.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthTestSupport {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public String bearerTokenForUserId(long userId) {
        User user = userRepository
                .findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        return jwtService.issueAccessToken(user).token();
    }

    public String authorizationHeader(long userId) {
        return HttpHeaders.AUTHORIZATION + " Bearer " + bearerTokenForUserId(userId);
    }
}
