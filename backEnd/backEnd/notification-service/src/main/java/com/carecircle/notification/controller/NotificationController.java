package com.carecircle.notification.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.carecircle.notification.dto.NotificationResponse;
import com.carecircle.notification.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(
            NotificationService notificationService) {

        this.notificationService = notificationService;
    }

    /**
     * Get notification by ID.
     */
    @GetMapping("/{notificationId}")
    public ResponseEntity<NotificationResponse> getNotificationById(
            @PathVariable UUID notificationId) {

        NotificationResponse response =
                notificationService.getNotificationById(
                        notificationId);

        return ResponseEntity.ok(response);
    }

    /**
     * Get all notifications.
     */
    @GetMapping
    public ResponseEntity<List<NotificationResponse>>
    getAllNotifications() {

        List<NotificationResponse> responses =
                notificationService.getAllNotifications();

        return ResponseEntity.ok(responses);
    }

    /**
     * Get notifications by family.
     */
    @GetMapping("/family/{familyId}")
    public ResponseEntity<List<NotificationResponse>>
    getNotificationsByFamily(
            @PathVariable UUID familyId) {

        List<NotificationResponse> responses =
                notificationService.getNotificationsByFamily(
                        familyId);

        return ResponseEntity.ok(responses);
    }

    /**
     * Get notifications by member.
     */
    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<NotificationResponse>>
    getNotificationsByMember(
            @PathVariable UUID memberId) {

        List<NotificationResponse> responses =
                notificationService.getNotificationsByMember(
                        memberId);

        return ResponseEntity.ok(responses);
    }

    /**
     * Delete notification.
     */
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<String> deleteNotification(
            @PathVariable UUID notificationId) {

        notificationService.deleteNotification(
                notificationId);

        return ResponseEntity.ok(
                "Notification deleted successfully.");
    }
}