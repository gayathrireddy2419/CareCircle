package com.carecircle.notification.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.carecircle.notification.dto.NotificationRequest;
import com.carecircle.notification.dto.NotificationResponse;
import com.carecircle.notification.entity.NotificationType;

@Service
public class MedicationNotificationServiceImpl {

    private final NotificationService notificationService;

    public MedicationNotificationServiceImpl(
            NotificationService notificationService) {

        this.notificationService = notificationService;
    }

    /**
     * Send medicine reminder.
     */
    public NotificationResponse sendMedicineReminder(
            UUID familyId,
            UUID memberId,
            String phoneNumber,
            UUID medicineId,
            String message) {

        return sendMedicineNotification(
                familyId,
                memberId,
                phoneNumber,
                medicineId,
                message,
                NotificationType.MEDICINE_REMINDER);
    }

    /**
     * Send medicine refill alert.
     */
    public NotificationResponse sendMedicineRefillAlert(
            UUID familyId,
            UUID memberId,
            String phoneNumber,
            UUID medicineId,
            String message) {

        return sendMedicineNotification(
                familyId,
                memberId,
                phoneNumber,
                medicineId,
                message,
                NotificationType.MEDICINE_REFILL_ALERT);
    }

    /**
     * Send medicine expiry alert.
     */
    public NotificationResponse sendMedicineExpiryAlert(
            UUID familyId,
            UUID memberId,
            String phoneNumber,
            UUID medicineId,
            String message) {

        return sendMedicineNotification(
                familyId,
                memberId,
                phoneNumber,
                medicineId,
                message,
                NotificationType.MEDICINE_EXPIRY_ALERT);
    }

    private NotificationResponse sendMedicineNotification(
            UUID familyId,
            UUID memberId,
            String phoneNumber,
            UUID medicineId,
            String message,
            NotificationType notificationType) {

        NotificationRequest request =
                new NotificationRequest();

        request.setFamilyId(familyId);
        request.setMemberId(memberId);
        request.setPhoneNumber(phoneNumber);
        request.setNotificationType(notificationType);
        request.setReferenceId(medicineId);
        request.setMessage(message);

        return notificationService.sendNotification(request);
    }
}