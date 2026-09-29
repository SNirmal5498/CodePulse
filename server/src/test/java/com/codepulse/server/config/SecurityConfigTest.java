package com.codepulse.server.config;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import static org.junit.jupiter.api.Assertions.*;

class SecurityConfigTest {

    @Test
    void corsConfigurationShouldAllowFrontendOrigins() {

        SecurityConfig securityConfig =
                new SecurityConfig(null, null);

        CorsConfigurationSource source =
                securityConfig.corsConfigurationSource();

        assertNotNull(source);

        MockHttpServletRequest request =
                new MockHttpServletRequest();

        CorsConfiguration configuration =
                source.getCorsConfiguration(request);

        assertNotNull(configuration);

        assertTrue(
                configuration.getAllowedOrigins()
                        .contains("http://localhost:5173")
        );

        assertTrue(
                configuration.getAllowedOrigins()
                        .contains("http://localhost:5174")
        );

        assertTrue(
                configuration.getAllowedMethods()
                        .contains("GET")
        );

        assertTrue(
                configuration.getAllowedMethods()
                        .contains("POST")
        );

        assertTrue(
                configuration.getAllowedHeaders()
                        .contains("*")
        );

        assertTrue(
                configuration.getAllowCredentials()
        );
    }
}