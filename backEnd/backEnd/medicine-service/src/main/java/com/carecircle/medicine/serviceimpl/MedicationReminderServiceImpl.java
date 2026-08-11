package com.carecircle.medicine.serviceimpl;

import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.carecircle.medicine.dto.request.MedicationReminderRequest;
import com.carecircle.medicine.dto.response.MedicationReminderResponse;
import com.carecircle.medicine.entity.MedicationReminder;
import com.carecircle.medicine.exception.MedicationReminderNotFoundException;
import com.carecircle.medicine.repository.MedicationReminderRepository;
import com.carecircle.medicine.service.MedicationReminderService;

@Service
public class MedicationReminderServiceImpl implements MedicationReminderService {

    private final MedicationReminderRepository reminderRepository;

    public MedicationReminderServiceImpl(
            MedicationReminderRepository reminderRepository) {

        this.reminderRepository = reminderRepository;
    }

    @Override
    public MedicationReminderResponse addReminder(
            UUID scheduleId,
            MedicationReminderRequest request) {

        MedicationReminder reminder = new MedicationReminder();

        reminder.setScheduleId(scheduleId);
        reminder.setReminderTime(request.getReminderTime());
        reminder.setEnabled(request.getEnabled());

        MedicationReminder saved =
                reminderRepository.save(reminder);

        return mapToResponse(saved);
    }

    @Override
    public List<MedicationReminderResponse> getRemindersBySchedule(
            UUID scheduleId) {

        return reminderRepository.findByScheduleId(scheduleId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MedicationReminderResponse> getRemindersByTime(
            LocalTime reminderTime) {

        return reminderRepository.findByReminderTime(reminderTime)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public MedicationReminderResponse updateReminder(
            UUID reminderId,
            MedicationReminderRequest request) {

        MedicationReminder reminder =
                reminderRepository.findById(reminderId)
                        .orElseThrow(() ->
                                new MedicationReminderNotFoundException(
                                        "Reminder not found with ID : "
                                                + reminderId));

        reminder.setReminderTime(request.getReminderTime());
        reminder.setEnabled(request.getEnabled());

        MedicationReminder updated =
                reminderRepository.save(reminder);

        return mapToResponse(updated);
    }

    @Override
    public void deleteReminder(UUID reminderId) {

        MedicationReminder reminder =
                reminderRepository.findById(reminderId)
                        .orElseThrow(() ->
                                new MedicationReminderNotFoundException(
                                        "Reminder not found with ID : "
                                                + reminderId));

        reminderRepository.delete(reminder);
    }

    private MedicationReminderResponse mapToResponse(
            MedicationReminder reminder) {

        MedicationReminderResponse response =
                new MedicationReminderResponse();

        response.setReminderId(reminder.getReminderId());
        response.setScheduleId(reminder.getScheduleId());
        response.setReminderTime(reminder.getReminderTime());
        response.setEnabled(reminder.getEnabled());
        response.setCreatedAt(reminder.getCreatedAt());

        return response;
    }
}