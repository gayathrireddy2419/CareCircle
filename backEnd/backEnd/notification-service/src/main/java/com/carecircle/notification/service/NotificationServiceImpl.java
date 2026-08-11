package com.carecircle.notification.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.carecircle.notification.dto.NotificationRequest;
import com.carecircle.notification.dto.NotificationResponse;
import com.carecircle.notification.entity.Notification;
import com.carecircle.notification.entity.NotificationStatus;
import com.carecircle.notification.entity.ResponseType;
import com.carecircle.notification.repository.NotificationRepository;

@Service
public class NotificationServiceImpl
        implements NotificationService {

    private final NotificationRepository notificationRepository;

    private final TwilioService twilioService;

    public NotificationServiceImpl(
            NotificationRepository notificationRepository,
            TwilioService twilioService) {

        this.notificationRepository =
                notificationRepository;

        this.twilioService = twilioService;
    }

    @Override
    public NotificationResponse sendNotification(
            NotificationRequest request) {

        Notification notification =
                new Notification();

        notification.setFamilyId(
                request.getFamilyId());

        notification.setMemberId(
                request.getMemberId());

        notification.setPhoneNumber(
                request.getPhoneNumber());

        notification.setNotificationType(
                request.getNotificationType());

        notification.setReferenceId(
                request.getReferenceId());

        notification.setMessage(
                request.getMessage());

        notification.setStatus(
                NotificationStatus.PENDING);

        notification.setResponse(
                ResponseType.NONE);

        try {

            String providerId =
                    twilioService.sendMessage(
                            request.getPhoneNumber(),
                            request.getMessage());

            notification.setProviderMessageId(
                    providerId);

            notification.setStatus(
                    NotificationStatus.SENT);

            notification.setSentAt(
                    LocalDateTime.now());

        } catch (Exception ex) {

            notification.setStatus(
                    NotificationStatus.FAILED);

            System.err.println(
                    "Notification sending failed: "
                    + ex.getMessage());
        }

        Notification saved =
                notificationRepository.save(
                        notification);

        return mapToResponse(saved);
    }

    @Override
    public NotificationResponse getNotificationById(
            UUID notificationId) {

        Notification notification =
                notificationRepository
                        .findById(notificationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found"));

        return mapToResponse(notification);
    }

    @Override
    public List<NotificationResponse>
    getAllNotifications() {

        return notificationRepository
                .findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<NotificationResponse>
    getNotificationsByFamily(
            UUID familyId) {

        return notificationRepository
                .findByFamilyId(familyId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<NotificationResponse>
    getNotificationsByMember(
            UUID memberId) {

        return notificationRepository
                .findByMemberId(memberId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteNotification(
            UUID notificationId) {

        if (!notificationRepository
                .existsById(notificationId)) {

            throw new RuntimeException(
                    "Notification not found");
        }

        notificationRepository.deleteById(
                notificationId);
    }

    private NotificationResponse mapToResponse(
            Notification notification) {

        NotificationResponse response =
                new NotificationResponse();

        response.setNotificationId(
                notification.getNotificationId());

        response.setFamilyId(
                notification.getFamilyId());

        response.setMemberId(
                notification.getMemberId());

        response.setPhoneNumber(
                notification.getPhoneNumber());

        response.setNotificationType(
                notification.getNotificationType());

        response.setReferenceId(
                notification.getReferenceId());

        response.setMessage(
                notification.getMessage());

        response.setStatus(
                notification.getStatus());

        response.setResponse(
                notification.getResponse());

        response.setProviderMessageId(
                notification.getProviderMessageId());

        response.setSentAt(
                notification.getSentAt());

        response.setRespondedAt(
                notification.getRespondedAt());

        response.setCreatedAt(
                notification.getCreatedAt());

        return response;
    }
}