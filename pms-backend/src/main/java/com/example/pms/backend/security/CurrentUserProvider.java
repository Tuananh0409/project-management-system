package com.example.pms.backend.security;

import com.example.pms.backend.entity.User;
import com.example.pms.backend.exception.BusinessException;
import com.example.pms.backend.exception.ErrorCode;
import com.example.pms.backend.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Component;

/**
 * Temporary identity until login (S10): pass {@code X-User-Id} header (dev: 1 = admin, 2 = member).
 */
@Component
public class CurrentUserProvider {

    public static final String USER_ID_HEADER = "X-User-Id";
    private static final long DEFAULT_USER_ID = 1L;

    private final UserRepository userRepository;
    private final ObjectProvider<HttpServletRequest> requestProvider;

    public CurrentUserProvider(
            UserRepository userRepository,
            ObjectProvider<HttpServletRequest> requestProvider) {
        this.userRepository = userRepository;
        this.requestProvider = requestProvider;
    }

    public User getCurrentUser() {
        long userId = DEFAULT_USER_ID;
        HttpServletRequest request = requestProvider.getIfAvailable();
        if (request != null) {
            String header = request.getHeader(USER_ID_HEADER);
            if (header != null && !header.isBlank()) {
                try {
                    userId = Long.parseLong(header.trim());
                } catch (NumberFormatException ignored) {
                    // keep default
                }
            }
        }
        return userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
    }
}
