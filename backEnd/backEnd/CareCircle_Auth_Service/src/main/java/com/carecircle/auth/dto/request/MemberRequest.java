package com.carecircle.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class MemberRequest {

    @NotBlank(message = "Member name is required")
    private String name;

    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid mobile number")
    private String mobileNumber;

    @Size(min = 6, message = "Password must contain at least 6 characters")
    private String password;

    public MemberRequest() {
    }

    public MemberRequest(String name, String mobileNumber, String password) {
        this.name = name;
        this.mobileNumber = mobileNumber;
        this.password = password;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}