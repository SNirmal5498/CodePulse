package com.codepulse.server.controller;

import com.codepulse.server.dto.UserProfileResponse;
import com.codepulse.server.model.User;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @GetMapping("/profile")
    public UserProfileResponse profile(Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return new UserProfileResponse(user);
    }
}
