package com.carecircle.medicine.dto.request;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

import com.carecircle.medicine.enums.IntakeStatus;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class MedicineIntakeHistoryRequest {

    private UUID scheduleId;
    private UUID reminderId;
    private UUID memberId;
    private LocalDate intakeDate;
    private LocalTime reminderTime;
    private LocalDateTime takenTime;
    private IntakeStatus status;

    @Size(max = 500, message = "Remarks cannot exceed 500 characters.")
    private String remarks;

    public MedicineIntakeHistoryRequest() {
    }

    public UUID getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(UUID scheduleId) {
        this.scheduleId = scheduleId;
    }

    public UUID getReminderId() {
        return reminderId;
    }

    public void setReminderId(UUID reminderId) {
        this.reminderId = reminderId;
    }

    public UUID getMemberId() {
        return memberId;
    }

    public void setMemberId(UUID memberId) {
        this.memberId = memberId;
    }

    public LocalDate getIntakeDate() {
        return intakeDate;
    }

    public void setIntakeDate(LocalDate intakeDate) {
        this.intakeDate = intakeDate;
    }

    public LocalTime getReminderTime() {
        return reminderTime;
    }

    public void setReminderTime(LocalTime reminderTime) {
        this.reminderTime = reminderTime;
    }

    public LocalDateTime getTakenTime() {
        return takenTime;
    }

    public void setTakenTime(LocalDateTime takenTime) {
        this.takenTime = takenTime;
    }

    public IntakeStatus getStatus() {
        return status;
    }

    public void setStatus(IntakeStatus status) {
        this.status = status;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}