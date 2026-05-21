package com.example.pms.backend.service;

import com.example.pms.backend.dto.auth.AuthResponse;
import com.example.pms.backend.dto.auth.ChangePasswordRequest;
import com.example.pms.backend.dto.auth.LoginRequest;
import com.example.pms.backend.dto.auth.RegisterRequest;
import com.example.pms.backend.dto.auth.UpdateProfileRequest;
import com.example.pms.backend.entity.User;
import com.example.pms.backend.exception.BusinessException;
import com.example.pms.backend.exception.ErrorCode;
import com.example.pms.backend.repository.UserRepository;
import com.example.pms.backend.security.CurrentUserProvider;
import com.example.pms.backend.security.JwtService;
import com.example.pms.backend.security.JwtService.IssuedToken;
import com.example.pms.backend.security.JwtTokenPayload;
import com.example.pms.backend.security.TokenBlacklistService;
import com.example.pms.backend.security.JwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final String STATUS_ACTIVE = "ACTIVE";
    private static final String STATUS_PENDING = "PENDING";
    private static final String STATUS_LOCKED = "LOCKED";
    private static final String TOKEN_TYPE_BEARER = "Bearer";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final TokenBlacklistService tokenBlacklistService;
    private final CurrentUserProvider currentUserProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BusinessException(ErrorCode.PASSWORD_MISMATCH);
        }

        String email = request.getEmail().trim().toLowerCase();
        String username = request.getFullName().trim();

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new BusinessException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }
        if (userRepository.existsByUsernameIgnoreCase(username)) {
            throw new BusinessException(
                    ErrorCode.VALIDATION_ERROR, "Tên hiển thị đã được sử dụng");
        }

        User user = User.builder()
                .email(email)
                .username(username)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .status(STATUS_ACTIVE)
                .build();

        user = userRepository.save(user);
        return toResponseWithToken(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = authenticateCredentials(request.getEmail(), request.getPassword());
        return toResponseWithToken(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse currentUser() {
        User user = currentUserProvider.getCurrentUser();
        return toResponseWithoutToken(user);
    }

    @Transactional
    public void logout(String accessToken) {
        if (accessToken == null || accessToken.isBlank()) {
            return;
        }
        try {
            JwtTokenPayload payload = jwtService.parseAndValidate(accessToken);
            tokenBlacklistService.revoke(payload.jti(), jwtService.getExpiration(accessToken));
        } catch (JwtException ignored) {
            // token đã hỏng — coi như đã logout
        }
    }

    @Transactional
    public AuthResponse updateProfile(UpdateProfileRequest request) {
        User user = currentUserProvider.getCurrentUser();
        String username = request.getUsername().trim();
        if (userRepository.existsByUsernameIgnoreCaseAndIdNot(username, user.getId())) {
            throw new BusinessException(
                    ErrorCode.VALIDATION_ERROR, "Tên hiển thị đã được sử dụng");
        }
        user.setUsername(username);
        user = userRepository.save(user);
        return toResponseWithoutToken(user);
    }

    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new BusinessException(ErrorCode.PASSWORD_MISMATCH);
        }
        User user = currentUserProvider.getCurrentUser();
        if (user.getPasswordHash() == null
                || !passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Mật khẩu hiện tại không đúng");
        }
        if (passwordEncoder.matches(request.getNewPassword(), user.getPasswordHash())) {
            throw new BusinessException(
                    ErrorCode.VALIDATION_ERROR, "Mật khẩu mới phải khác mật khẩu hiện tại");
        }
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private User authenticateCredentials(String emailRaw, String password) {
        String email = emailRaw.trim().toLowerCase();
        User user = userRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_CREDENTIALS));

        if (STATUS_LOCKED.equalsIgnoreCase(user.getStatus())) {
            throw new BusinessException(ErrorCode.ACCOUNT_LOCKED);
        }

        if (user.getPasswordHash() == null
                || !passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
        }

        if (STATUS_PENDING.equalsIgnoreCase(user.getStatus())) {
            throw new BusinessException(
                    ErrorCode.ACCOUNT_LOCKED, "Tài khoản chưa được kích hoạt");
        }

        return user;
    }

    private AuthResponse toResponseWithToken(User user) {
        IssuedToken issued = jwtService.issueAccessToken(user);
        return AuthResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .status(user.getStatus())
                .accessToken(issued.token())
                .tokenType(TOKEN_TYPE_BEARER)
                .expiresInSeconds(issued.expiresInSeconds())
                .build();
    }

    private AuthResponse toResponseWithoutToken(User user) {
        return AuthResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .status(user.getStatus())
                .build();
    }
}
