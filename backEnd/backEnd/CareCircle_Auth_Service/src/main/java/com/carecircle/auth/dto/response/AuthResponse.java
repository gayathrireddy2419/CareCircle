package com.carecircle.auth.dto.response;

import java.util.UUID;

import com.carecircle.auth.entity.Role;

public class AuthResponse {

    private String token;
    private UUID userId;
    private UUID familyId;
    private String name;
    private Role role;

    public AuthResponse() {
    }

    public AuthResponse(String token,
                        UUID userId,
                        UUID familyId,
                        String name,
                        Role role) {
        this.token = token;
        this.userId = userId;
        this.familyId = familyId;
        this.name = name;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public UUID getFamilyId() {
        return familyId;
    }

    public void setFamilyId(UUID familyId) {
        this.familyId = familyId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}