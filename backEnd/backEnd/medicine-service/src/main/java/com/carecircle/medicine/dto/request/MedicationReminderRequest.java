package com.carecircle.medicine.dto.request;

import java.time.LocalTime;

import jakarta.validation.constraints.NotNull;

public class MedicationReminderRequest {

    @NotNull(message = "Reminder time is required")
    private LocalTime reminderTime;

    @NotNull(message = "Enabled flag is required")
    private Boolean enabled;

    public MedicationReminderRequest() {
    }

    public LocalTime getReminderTime() {
        return reminderTime;
    }

    public void setReminderTime(LocalTime reminderTime) {
        this.reminderTime = reminderTime;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }
}