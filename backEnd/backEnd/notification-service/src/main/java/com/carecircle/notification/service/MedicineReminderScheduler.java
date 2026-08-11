package com.carecircle.notification.service;

import org.springframework.stereotype.Component;

@Component
public class MedicineReminderScheduler {

    /*
     * Medicine reminders are not generated using random/demo data.
     *
     * Medicine Service will trigger notifications through
     * the internal Notification API.
     *
     * This scheduler is intentionally disabled for now.
     */

    public MedicineReminderScheduler() {
    }
}