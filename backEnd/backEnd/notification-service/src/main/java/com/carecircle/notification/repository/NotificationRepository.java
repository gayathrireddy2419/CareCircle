package com.carecircle.notification.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.carecircle.notification.entity.Notification;
import com.carecircle.notification.entity.NotificationStatus;
import com.carecircle.notification.entity.NotificationType;

@Repository
public interface NotificationRepository
        extends JpaRepository<Notification, UUID> {

    List<Notification> findByFamilyId(UUID familyId);

    List<Notification> findByMemberId(UUID memberId);

    List<Notification> findByNotificationType(
            NotificationType notificationType);

    List<Notification> findByStatus(
            NotificationStatus status);

    List<Notification> findByMemberIdAndStatus(
            UUID memberId,
            NotificationStatus status);

    List<Notification> findByFamilyIdAndNotificationType(
            UUID familyId,
            NotificationType notificationType);
}