package com.codepulse.server.controller;


import com.codepulse.server.dto.LoginRequest;
import com.codepulse.server.dto.LoginResponse;
import com.codepulse.server.dto.RegisterRequest;
import com.codepulse.server.dto.RegisterResponse;
import com.codepulse.server.service.AuthService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
        @Valid @RequestBody RegisterRequest request) {

    var user = authService.register(
        request.getName(),
        request.getEmail(),
        request.getPassword()
    );

    RegisterResponse response = new RegisterResponse(user);

    return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
        @Valid @RequestBody LoginRequest request) {

    String token = authService.login(
            request.getEmail(),
            request.getPassword()
    );

    LoginResponse response = new LoginResponse(token);

    return ResponseEntity.ok(response);
    }
}