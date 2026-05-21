package com.example.pms.backend.security;

import com.example.pms.backend.entity.User;
import com.example.pms.backend.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final TokenBlacklistService tokenBlacklistService;
    private final UserRepository userRepository;
    private final AuthCookieService authCookieService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        authCookieService.resolveToken(request).flatMap(this::authenticate).ifPresent(auth -> {
            auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(auth);
        });
        filterChain.doFilter(request, response);
    }

    private Optional<UsernamePasswordAuthenticationToken> authenticate(String token) {
        try {
            JwtTokenPayload payload = jwtService.parseAndValidate(token);
            if (tokenBlacklistService.isRevoked(payload.jti())) {
                return Optional.empty();
            }
            Optional<User> userOpt = userRepository.findById(payload.userId());
            if (userOpt.isEmpty()) {
                return Optional.empty();
            }
            User user = userOpt.get();
            AuthenticatedUser principal =
                    new AuthenticatedUser(user.getId(), user.getEmail(), user.getUsername(), user.getStatus());
            if (!principal.isEnabled() || !principal.isAccountNonLocked()) {
                return Optional.empty();
            }
            return Optional.of(new UsernamePasswordAuthenticationToken(
                    principal, null, principal.getAuthorities()));
        } catch (JwtException ex) {
            return Optional.empty();
        }
    }
}
