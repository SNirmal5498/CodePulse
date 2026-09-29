package com.codepulse.server.controller;

import com.codepulse.server.model.User;
import com.codepulse.server.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void register_shouldReturnCreatedResponse() {

        User user = new User();
        user.setName("Nirmal");
        user.setEmail("nirmal@example.com");

        when(authService.register(
                "Nirmal",
                "nirmal@example.com",
                "password123"
        )).thenReturn(user);

        var request = new com.codepulse.server.dto.RegisterRequest();
        request.setName("Nirmal");
        request.setEmail("nirmal@example.com");
        request.setPassword("password123");

        ResponseEntity<?> response = authController.register(request);

        assertEquals(201, response.getStatusCode().value());
        assertNotNull(response.getBody());

        verify(authService).register(
                "Nirmal",
                "nirmal@example.com",
                "password123"
        );
    }

    @Test
    void login_shouldReturnHttpOnlyCookie() {

        when(authService.login(
                "nirmal@example.com",
                "password123"
        )).thenReturn("test-jwt-token");

        var request = new com.codepulse.server.dto.LoginRequest();
        request.setEmail("nirmal@example.com");
        request.setPassword("password123");

        ResponseEntity<Void> response = authController.login(request);

        assertEquals(200, response.getStatusCode().value());

        String cookie = response.getHeaders()
                .getFirst(HttpHeaders.SET_COOKIE);

        assertNotNull(cookie);
        assertTrue(cookie.contains("codepulse_token=test-jwt-token"));
        assertTrue(cookie.contains("HttpOnly"));
        assertTrue(cookie.contains("Path=/"));
        assertTrue(cookie.contains("Max-Age=86400"));

        verify(authService).login(
                "nirmal@example.com",
                "password123"
        );
    }

    @Test
    void logout_shouldClearAuthenticationCookie() {

        ResponseEntity<Void> response = authController.logout();

        assertEquals(204, response.getStatusCode().value());

        String cookie = response.getHeaders()
                .getFirst(HttpHeaders.SET_COOKIE);

        assertNotNull(cookie);
        assertTrue(cookie.contains("codepulse_token="));
        assertTrue(cookie.contains("Max-Age=0"));
        assertTrue(cookie.contains("HttpOnly"));
        assertTrue(cookie.contains("Path=/"));
    }
}