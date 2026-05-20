package com.example.pms.backend.config;

import com.example.pms.backend.entity.User;
import com.example.pms.backend.repository.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Đảm bảo tài khoản dev seed có mật khẩu (nếu Flyway V4 chưa chạy / DB cũ).
 */
@Component
@Profile("dev")
@RequiredArgsConstructor
@Slf4j
public class DevUserPasswordInitializer {

    private static final String DEV_PASSWORD = "Admin@123";
    private static final List<String> DEV_EMAILS =
            List.of("admin@ctel.local", "member@ctel.local");

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void ensureDevPasswords() {
        for (String email : DEV_EMAILS) {
            userRepository.findByEmailIgnoreCase(email).ifPresent(this::ensurePassword);
        }
    }

    private void ensurePassword(User user) {
        String hash = user.getPasswordHash();
        if (hash != null && !hash.isBlank()) {
            return;
        }
        user.setPasswordHash(passwordEncoder.encode(DEV_PASSWORD));
        userRepository.save(user);
        log.info("Đã gán mật khẩu dev cho user: {}", user.getEmail());
    }
}
