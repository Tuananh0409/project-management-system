package com.example.pms.backend.auth;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.pms.backend.security.AuthCookieService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class AuthApiTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AuthTestSupport authTestSupport;

    @Test
    void login_setsHttpOnlyCookie() throws Exception {
        String body = objectMapper.writeValueAsString(Map.of(
                "email", "admin@ctel.local",
                "password", "Admin@123"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(cookie().exists(AuthCookieService.COOKIE_NAME))
                .andExpect(jsonPath("$.email").value("admin@ctel.local"))
                .andExpect(jsonPath("$.accessToken").doesNotExist());
    }

    @Test
    void protectedEndpoint_requiresAuth() throws Exception {
        mockMvc.perform(get("/api/workspaces")).andExpect(status().isUnauthorized());
    }

    @Test
    void protectedEndpoint_acceptsSessionCookie() throws Exception {
        String token = authTestSupport.bearerTokenForUserId(1);
        mockMvc.perform(get("/api/workspaces").cookie(new jakarta.servlet.http.Cookie(AuthCookieService.COOKIE_NAME, token)))
                .andExpect(status().isOk());
    }
}
