package com.codepulse.server.security;

import com.codepulse.server.model.User;
import com.codepulse.server.repository.UserRepository;
import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class JwtAuthenticationFilterTest {

    @Mock
    private JwtService jwtService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private FilterChain filterChain;

    private JwtAuthenticationFilter filter;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        filter = new JwtAuthenticationFilter(
                jwtService,
                userRepository
        );

        SecurityContextHolder.clearContext();
    }

    @Test
    void shouldContinueWhenCookieIsMissing() throws Exception {

        MockHttpServletRequest request =
                new MockHttpServletRequest();

        MockHttpServletResponse response =
                new MockHttpServletResponse();

        filter.doFilterInternal(
                request,
                response,
                filterChain
        );

        verify(filterChain).doFilter(request, response);

        verifyNoInteractions(jwtService);
        verifyNoInteractions(userRepository);

        assertNull(
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
        );
    }

    @Test
    void shouldContinueWhenTokenIsInvalid() throws Exception {

        MockHttpServletRequest request =
                new MockHttpServletRequest();

        request.setCookies(
                new jakarta.servlet.http.Cookie(
                        "codepulse_token",
                        "invalid-token"
                )
        );

        MockHttpServletResponse response =
                new MockHttpServletResponse();

        when(jwtService.isTokenValid("invalid-token"))
                .thenReturn(false);

        filter.doFilterInternal(
                request,
                response,
                filterChain
        );

        verify(jwtService)
                .isTokenValid("invalid-token");

        verify(filterChain)
                .doFilter(request, response);

        verifyNoInteractions(userRepository);

        assertNull(
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
        );
    }

    @Test
    void shouldAuthenticateUserWhenTokenIsValid() throws Exception {

        MockHttpServletRequest request =
                new MockHttpServletRequest();

        request.setCookies(
                new jakarta.servlet.http.Cookie(
                        "codepulse_token",
                        "valid-token"
                )
        );

        MockHttpServletResponse response =
                new MockHttpServletResponse();

        User user = new User();
        user.setName("Nirmal");
        user.setEmail("nirmal@example.com");
        user.setRole("USER");

        when(jwtService.isTokenValid("valid-token"))
                .thenReturn(true);

        when(jwtService.extractEmail("valid-token"))
                .thenReturn("nirmal@example.com");

        when(userRepository.findByEmail(
                "nirmal@example.com"
        )).thenReturn(Optional.of(user));

        filter.doFilterInternal(
                request,
                response,
                filterChain
        );

        assertNotNull(
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
        );

        assertEquals(
                user,
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal()
        );

        verify(userRepository)
                .findByEmail("nirmal@example.com");

        verify(filterChain)
                .doFilter(request, response);
    }

    @Test
    void shouldContinueWhenUserDoesNotExist() throws Exception {

        MockHttpServletRequest request =
                new MockHttpServletRequest();

        request.setCookies(
                new jakarta.servlet.http.Cookie(
                        "codepulse_token",
                        "valid-token"
                )
        );

        MockHttpServletResponse response =
                new MockHttpServletResponse();

        when(jwtService.isTokenValid("valid-token"))
                .thenReturn(true);

        when(jwtService.extractEmail("valid-token"))
                .thenReturn("unknown@example.com");

        when(userRepository.findByEmail(
                "unknown@example.com"
        )).thenReturn(Optional.empty());

        filter.doFilterInternal(
                request,
                response,
                filterChain
        );

        assertNull(
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
        );

        verify(filterChain)
                .doFilter(request, response);
    }
}