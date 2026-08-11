package com.carecircle.medicine.service;

import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

import com.carecircle.medicine.dto.request.MedicationReminderRequest;
import com.carecircle.medicine.dto.response.MedicationReminderResponse;

public interface MedicationReminderService {

    MedicationReminderResponse addReminder(
            UUID scheduleId,
            MedicationReminderRequest request);

    List<MedicationReminderResponse> getRemindersBySchedule(
            UUID scheduleId);

    List<MedicationReminderResponse> getRemindersByTime(
            LocalTime reminderTime);

    MedicationReminderResponse updateReminder(
            UUID reminderId,
            MedicationReminderRequest request);

    void deleteReminder(
            UUID reminderId);

}