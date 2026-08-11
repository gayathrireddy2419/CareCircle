package com.carecircle.auth.controller;

import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.carecircle.auth.dto.response.InternalUserResponse;
import com.carecircle.auth.service.AuthService;

@RestController
@RequestMapping("/internal/users")
public class InternalUserController {

    private final AuthService authService;

    public InternalUserController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/{userId}")
    public InternalUserResponse getInternalUser(
            @PathVariable UUID userId) {

        return authService.getInternalUser(userId);
    }

    @GetMapping("/phone/{userId}")
    public String getMobileNumber(
            @PathVariable UUID userId) {

        return authService.getMobileNumber(userId);
    }
}