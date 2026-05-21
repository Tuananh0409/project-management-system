package com.example.pms.backend.security;

import com.example.pms.backend.entity.User;
import com.example.pms.backend.exception.BusinessException;
import com.example.pms.backend.exception.ErrorCode;
import com.example.pms.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CurrentUserProvider {

    /** @deprecated Chỉ dùng trong test cũ — dùng Bearer JWT. */
    @Deprecated
    public static final String USER_ID_HEADER = "X-User-Id";

    private final UserRepository userRepository;

    public User getCurrentUser() {
        AuthenticatedUser principal = getAuthenticatedPrincipal();
        return userRepository
                .findById(principal.getId())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
    }

    public AuthenticatedUser getAuthenticatedPrincipal() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof AuthenticatedUser principal)) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED);
        }
        return principal;
    }
}
