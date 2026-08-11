package com.carecircle.auth.dto.response;

import java.util.UUID;

import com.carecircle.auth.entity.Role;

public class MemberResponse {

    private UUID userId;
    private String name;
    private String mobileNumber;
    private Role role;

    public MemberResponse() {
    }

    public MemberResponse(UUID userId,
                          String name,
                          String mobileNumber,
                          Role role) {
        this.userId = userId;
        this.name = name;
        this.mobileNumber = mobileNumber;
        this.role = role;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}