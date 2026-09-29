package com.codepulse.server.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;

    private final String secret =
            "CodePulseJwtSecret_2026_ThisIsOnlyForLocalDevelopment_ChangeMe";

    @BeforeEach
    void setUp() {
        jwtService = new JwtService(secret);
    }

    @Test
    void shouldGenerateToken() {

        String token = jwtService.generateToken("test@example.com");

        assertNotNull(token);
        assertFalse(token.isBlank());
    }

    @Test
    void shouldExtractEmailFromToken() {

        String token = jwtService.generateToken("test@example.com");

        String email = jwtService.extractEmail(token);

        assertEquals("test@example.com", email);
    }

    @Test
    void shouldReturnTrueForValidToken() {

        String token = jwtService.generateToken("test@example.com");

        assertTrue(jwtService.isTokenValid(token));
    }

    @Test
    void shouldReturnFalseForInvalidToken() {

        assertFalse(jwtService.isTokenValid("invalid-token"));
    }
}