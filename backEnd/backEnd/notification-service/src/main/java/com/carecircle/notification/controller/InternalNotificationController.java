package com.carecircle.notification.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.carecircle.notification.dto.NotificationRequest;
import com.carecircle.notification.service.NotificationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/internal/notifications")
public class InternalNotificationController {

    private final NotificationService notificationService;

    public InternalNotificationController(
            NotificationService notificationService) {

        this.notificationService = notificationService;
    }

    /**
     * Internal notification endpoint.
     *
     * This endpoint is called ONLY by other microservices.
     *
     * Callers:
     * - Medicine Service
     * - Health Record Service
     */
    @PostMapping("/send")
    public ResponseEntity<Void> sendNotification(
            @Valid @RequestBody NotificationRequest request) {

        notificationService.sendNotification(request);

        return ResponseEntity.ok().build();
    }
}