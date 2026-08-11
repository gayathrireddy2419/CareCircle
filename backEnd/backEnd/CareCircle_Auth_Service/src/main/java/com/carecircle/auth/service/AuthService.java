package com.carecircle.auth.service;

import java.util.UUID;

import com.carecircle.auth.dto.request.HeadRegistrationRequest;
import com.carecircle.auth.dto.request.LoginRequest;
import com.carecircle.auth.dto.response.AuthResponse;
import com.carecircle.auth.dto.response.InternalUserResponse;

public interface AuthService {

    AuthResponse registerHead(HeadRegistrationRequest request);

    AuthResponse login(LoginRequest request);

    InternalUserResponse getInternalUser(UUID userId);

    String getMobileNumber(UUID userId);

}