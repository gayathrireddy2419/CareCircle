package com.carecircle.medicine.exception;

public class MedicationReminderNotFoundException extends RuntimeException {

    public MedicationReminderNotFoundException(String message) {
        super(message);
    }
}