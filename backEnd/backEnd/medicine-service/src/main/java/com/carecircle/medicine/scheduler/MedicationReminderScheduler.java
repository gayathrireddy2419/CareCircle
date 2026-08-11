package com.carecircle.medicine.scheduler;

import jakarta.annotation.PostConstruct;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.carecircle.medicine.service.MedicationNotificationService;

@Component
public class MedicationReminderScheduler {

    private final MedicationNotificationService medicationNotificationService;

    public MedicationReminderScheduler(
            MedicationNotificationService medicationNotificationService) {

        this.medicationNotificationService = medicationNotificationService;
    }

    @PostConstruct
    public void init() {

        System.out.println("======================================");
        System.out.println("MedicationReminderScheduler Loaded");
        System.out.println("======================================");
    }

    /**
     * Executes every 10 seconds (Temporary for testing)
     */
    @Scheduled(fixedRate = 10000)
    public void processMedicationReminders() {

        System.out.println("Scheduler Triggered");

        medicationNotificationService.sendDueReminders();
    }
}