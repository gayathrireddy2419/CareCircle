package com.example.oms.client;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.example.oms.dto.response.InternalUserResponse;

@Component
public class AuthHttpClient {

    private final RestClient restClient;

    public AuthHttpClient(
            @Value("${auth.service.url}") String authServiceUrl) {

        this.restClient = RestClient.builder()
                .baseUrl(authServiceUrl)
                .build();
    }

    /**
     * Fetch user details from Authentication Service.
     */
    public InternalUserResponse getInternalUser(UUID userId) {

        return restClient.get()

                .uri("/internal/users/{userId}", userId)

                .retrieve()

                .body(InternalUserResponse.class);
    }

}