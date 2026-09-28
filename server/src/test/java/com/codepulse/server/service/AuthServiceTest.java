package com.codepulse.server.service;

import com.codepulse.server.model.User;
import com.codepulse.server.repository.UserRepository;
import com.codepulse.server.security.JwtService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    private UserRepository userRepository;
    private JwtService jwtService;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        jwtService = mock(JwtService.class);

        authService = new AuthService(
                userRepository,
                jwtService
        );
    }

    @Test
    void shouldRegisterUserSuccessfully() {

        when(userRepository.existsByEmail("test@example.com"))
                .thenReturn(false);

        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setName("Test User");
        savedUser.setEmail("test@example.com");
        savedUser.setRole("USER");

        when(userRepository.save(any(User.class)))
                .thenReturn(savedUser);

        User result = authService.register(
                "Test User",
                "test@example.com",
                "Password@123"
        );

        assertNotNull(result);
        assertEquals("Test User", result.getName());
        assertEquals("test@example.com", result.getEmail());
        assertEquals("USER", result.getRole());

        ArgumentCaptor<User> captor =
                ArgumentCaptor.forClass(User.class);

        verify(userRepository).save(captor.capture());

        User saved = captor.getValue();

        assertNotEquals(
                "Password@123",
                saved.getPassword()
        );

        verify(userRepository)
                .existsByEmail("test@example.com");
    }

    @Test
    void shouldRejectDuplicateEmail() {

     when(userRepository.existsByEmail("test@example.com"))
            .thenReturn(true);

        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> authService.register(
                    "Test User",
                    "test@example.com",
                    "Password@123"
            )
        );

        assertEquals(
            "Email already registered",
            exception.getMessage()
        );

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void shouldLoginUserSuccessfully() {

        User user = new User();
        user.setId(1L);
        user.setName("Test User");
        user.setEmail("test@example.com");
        user.setPassword(
            new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder()
                    .encode("Password@123")
     );
      user.setRole("USER");

     when(userRepository.findByEmail("test@example.com"))
            .thenReturn(java.util.Optional.of(user));

      when(jwtService.generateToken("test@example.com"))
            .thenReturn("mock-jwt-token");

     String token = authService.login(
            "test@example.com",
            "Password@123"
      );

     assertNotNull(token);
     assertEquals("mock-jwt-token", token);

      verify(userRepository).findByEmail("test@example.com");
      verify(jwtService).generateToken("test@example.com");
    }

    @Test
    void shouldRejectInvalidPassword() {

      User user = new User();
      user.setEmail("test@example.com");
        user.setPassword(
            new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder()
                    .encode("Password@123")
      );

       when(userRepository.findByEmail("test@example.com"))
         .thenReturn(java.util.Optional.of(user));

      RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> authService.login(
                    "test@example.com",
                    "WrongPassword"
            )
      );

     assertEquals(
            "Invalid email or password",
            exception.getMessage()
       );

        verify(jwtService, never()).generateToken(anyString());
    }
}