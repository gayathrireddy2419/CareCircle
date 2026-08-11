package com.carecircle.medicine.client;

import java.util.UUID;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.carecircle.medicine.dto.response.InternalUserResponse;

@FeignClient(name = "carecircle-auth-service")
public interface AuthFeignClient {

    @GetMapping("/internal/users/{userId}")
    InternalUserResponse getInternalUser(
            @PathVariable UUID userId);

    @GetMapping("/internal/users/phone/{userId}")
    String getMobileNumber(
            @PathVariable UUID userId);
}