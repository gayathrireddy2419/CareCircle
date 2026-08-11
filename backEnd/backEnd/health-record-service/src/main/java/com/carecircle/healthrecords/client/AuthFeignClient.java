package com.carecircle.healthrecords.client;

import java.util.UUID;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.carecircle.healthrecords.dto.response.InternalUserResponse;

@FeignClient(name = "CARECIRCLE-AUTH-SERVICE")
public interface AuthFeignClient {

    @GetMapping("/internal/users/{userId}")
    InternalUserResponse getInternalUser(
            @PathVariable UUID userId);

}