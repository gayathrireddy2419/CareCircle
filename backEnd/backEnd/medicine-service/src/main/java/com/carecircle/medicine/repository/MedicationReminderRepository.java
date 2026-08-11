package com.carecircle.medicine.repository;

import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.carecircle.medicine.entity.MedicationReminder;

@Repository
public interface MedicationReminderRepository
        extends JpaRepository<MedicationReminder, UUID> {

    List<MedicationReminder> findByScheduleId(UUID scheduleId);

    List<MedicationReminder> findByEnabled(Boolean enabled);

    List<MedicationReminder> findByReminderTime(LocalTime reminderTime);

    List<MedicationReminder> findByReminderTimeAndEnabled(
            LocalTime reminderTime,
            Boolean enabled);

    List<MedicationReminder> findByReminderTimeAndEnabledAndNotificationSent(
            LocalTime reminderTime,
            Boolean enabled,
            Boolean notificationSent);

}