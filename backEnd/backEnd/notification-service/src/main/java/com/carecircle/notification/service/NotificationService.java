package com.carecircle.notification.service;

import java.util.List;
import java.util.UUID;

import com.carecircle.notification.dto.NotificationRequest;
import com.carecircle.notification.dto.NotificationResponse;

public interface NotificationService {

    NotificationResponse sendNotification(
            NotificationRequest request);

    NotificationResponse getNotificationById(
            UUID notificationId);

    List<NotificationResponse> getAllNotifications();

    List<NotificationResponse> getNotificationsByFamily(
            UUID familyId);

    List<NotificationResponse> getNotificationsByMember(
            UUID memberId);

    void deleteNotification(
            UUID notificationId);
}