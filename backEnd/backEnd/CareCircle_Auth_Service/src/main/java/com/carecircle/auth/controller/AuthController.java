package com.carecircle.auth.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.carecircle.auth.dto.request.HeadRegistrationRequest;
import com.carecircle.auth.dto.request.LoginRequest;
import com.carecircle.auth.dto.response.AuthResponse;
import com.carecircle.auth.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
@Validated
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register-head")
    public ResponseEntity<AuthResponse> registerHead(
            @Valid @RequestBody HeadRegistrationRequest request) {

        return new ResponseEntity<>(
                authService.registerHead(request),
                HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {

        return ResponseEntity.ok(authService.login(request));
    }
}