package com.carecircle.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class HeadRegistrationRequest {

    @NotBlank(message = "Family name is required")
    private String familyName;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Mobile number is required")
    @Pattern(
        regexp = "^[6-9]\\d{9}$",
        message = "Invalid mobile number"
    )
    private String mobileNumber;

    @NotBlank(message = "Password is required")
    @Size(
        min = 6,
        message = "Password must be at least 6 characters long"
    )
    private String password;

    public HeadRegistrationRequest() {
    }

    public HeadRegistrationRequest(String familyName,
                                   String name,
                                   String mobileNumber,
                                   String password) {
        this.familyName = familyName;
        this.name = name;
        this.mobileNumber = mobileNumber;
        this.password = password;
    }

    public String getFamilyName() {
        return familyName;
    }

    public void setFamilyName(String familyName) {
        this.familyName = familyName;
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