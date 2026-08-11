package com.carecircle.notification.dto;

import java.util.UUID;

import com.carecircle.notification.entity.NotificationType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class NotificationRequest {

    @NotNull(message = "Family Id is required")
    private UUID familyId;

    @NotNull(message = "Member Id is required")
    private UUID memberId;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    @NotNull(message = "Notification type is required")
    private NotificationType notificationType;

    @NotNull(message = "Reference Id is required")
    private UUID referenceId;

    @NotBlank(message = "Message cannot be blank")
    private String message;

    public NotificationRequest() {
    }

    public UUID getFamilyId() {
        return familyId;
    }

    public void setFamilyId(UUID familyId) {
        this.familyId = familyId;
    }

    public UUID getMemberId() {
        return memberId;
    }

    public void setMemberId(UUID memberId) {
        this.memberId = memberId;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public NotificationType getNotificationType() {
        return notificationType;
    }

    public void setNotificationType(NotificationType notificationType) {
        this.notificationType = notificationType;
    }

    public UUID getReferenceId() {
        return referenceId;
    }

    public void setReferenceId(UUID referenceId) {
        this.referenceId = referenceId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}