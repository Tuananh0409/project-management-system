package com.example.pms.backend.auth;

import static org.assertj.core.api.Assertions.assertThat;

import com.example.pms.backend.config.SecurityConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

@SpringJUnitConfig
@Import(SecurityConfig.class)
class BcryptHashGeneratorTest {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void printDevPasswordHash() {
        String hash = passwordEncoder.encode("Admin@123");
        System.out.println("BCrypt(Admin@123)=" + hash);
        assertThat(passwordEncoder.matches("Admin@123", hash)).isTrue();
    }
}
