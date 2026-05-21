package com.example.pms.backend.controller;

import com.example.pms.backend.dto.auth.AuthResponse;
import com.example.pms.backend.dto.auth.ChangePasswordRequest;
import com.example.pms.backend.dto.auth.LoginRequest;
import com.example.pms.backend.dto.auth.RegisterRequest;
import com.example.pms.backend.dto.auth.UpdateProfileRequest;
import com.example.pms.backend.security.AuthCookieService;
import com.example.pms.backend.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AuthCookieService authCookieService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return authCookieService.sessionResponse(authService.register(request), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return authCookieService.sessionResponse(authService.login(request), HttpStatus.OK);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        authCookieService
                .resolveToken(request)
                .ifPresent(token -> authService.logout(token));
        return authCookieService.logoutResponse();
    }

    @GetMapping("/me")
    public AuthResponse me() {
        return authService.currentUser();
    }

    @PatchMapping("/profile")
    public AuthResponse updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        return authService.updateProfile(request);
    }

    @PostMapping("/change-password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(request);
    }
}
