package com.carecircle.notification.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.carecircle.notification.entity.Notification;
import com.carecircle.notification.entity.NotificationStatus;
import com.carecircle.notification.repository.NotificationRepository;

@Service
public class ReminderRetryService {

    private final NotificationRepository notificationRepository;

    private final TwilioService twilioService;

    public ReminderRetryService(
            NotificationRepository notificationRepository,
            TwilioService twilioService) {

        this.notificationRepository =
                notificationRepository;

        this.twilioService = twilioService;
    }

    /**
     * Retry failed notifications every 5 minutes.
     */
    @Scheduled(cron = "0 */5 * * * *")
    public void retryFailedNotifications() {

        List<Notification> failedNotifications =
                notificationRepository.findByStatus(
                        NotificationStatus.FAILED);

        for (Notification notification :
                failedNotifications) {

            try {

                String providerId =
                        twilioService.sendMessage(
                                notification.getPhoneNumber(),
                                notification.getMessage());

                notification.setProviderMessageId(
                        providerId);

                notification.setStatus(
                        NotificationStatus.SENT);

                notification.setSentAt(
                        LocalDateTime.now());

                notificationRepository.save(
                        notification);

                System.out.println(
                        "Notification retry successful: "
                        + notification.getNotificationId());

            } catch (Exception ex) {

                System.err.println(
                        "Notification retry failed: "
                        + notification.getNotificationId()
                        + " - "
                        + ex.getMessage());
            }
        }
    }
}