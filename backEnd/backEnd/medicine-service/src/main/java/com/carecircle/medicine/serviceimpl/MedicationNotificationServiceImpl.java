package com.carecircle.medicine.serviceimpl;

import java.time.LocalTime;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.carecircle.medicine.client.AuthFeignClient;
import com.carecircle.medicine.client.NotificationFeignClient;
import com.carecircle.medicine.dto.request.NotificationRequest;
import com.carecircle.medicine.dto.response.InternalUserResponse;
import com.carecircle.medicine.entity.MedicationReminder;
import com.carecircle.medicine.entity.MedicationSchedule;
import com.carecircle.medicine.entity.MedicineInventory;
import com.carecircle.medicine.enums.NotificationType;
import com.carecircle.medicine.repository.MedicationReminderRepository;
import com.carecircle.medicine.repository.MedicationScheduleRepository;
import com.carecircle.medicine.repository.MedicineInventoryRepository;
import com.carecircle.medicine.service.MedicationNotificationService;

@Service
public class MedicationNotificationServiceImpl
        implements MedicationNotificationService {

    private final MedicationReminderRepository reminderRepository;
    private final MedicationScheduleRepository scheduleRepository;
    private final MedicineInventoryRepository inventoryRepository;
    private final AuthFeignClient authFeignClient;
    private final NotificationFeignClient notificationFeignClient;

    public MedicationNotificationServiceImpl(
            MedicationReminderRepository reminderRepository,
            MedicationScheduleRepository scheduleRepository,
            MedicineInventoryRepository inventoryRepository,
            AuthFeignClient authFeignClient,
            NotificationFeignClient notificationFeignClient) {

        this.reminderRepository = reminderRepository;
        this.scheduleRepository = scheduleRepository;
        this.inventoryRepository = inventoryRepository;
        this.authFeignClient = authFeignClient;
        this.notificationFeignClient = notificationFeignClient;
    }

    @Override
    public void sendDueReminders() {

        LocalTime currentTime = LocalTime.now()
                .withSecond(0)
                .withNano(0);

        var reminders = reminderRepository.findByReminderTimeAndEnabled(
                currentTime,
                true);

        if (reminders.isEmpty()) {
            return;
        }

        System.out.println("Processing " + reminders.size() + " due medication reminder(s) for " + currentTime);

        for (MedicationReminder reminder : reminders) {
            try {
                Optional<MedicationSchedule> scheduleOpt = scheduleRepository.findById(reminder.getScheduleId());
                if (scheduleOpt.isEmpty()) {
                    continue;
                }

                MedicationSchedule schedule = scheduleOpt.get();
                Optional<MedicineInventory> inventoryOpt = inventoryRepository.findById(schedule.getInventoryId());

                String medicineName = inventoryOpt.map(MedicineInventory::getMedicineName).orElse("Prescription Medicine");
                String dosage = schedule.getDosage() != null ? schedule.getDosage() : "1 dose";
                String foodRelation = (schedule.getBeforeFood() != null && schedule.getBeforeFood()) ? "Before Food" : "After Food";

                String memberMobile = null;
                String memberName = "Family Member";

                try {
                    InternalUserResponse user = authFeignClient.getInternalUser(schedule.getMemberId());
                    if (user != null) {
                        memberMobile = user.getMobileNumber();
                        if (user.getFullName() != null && !user.getFullName().isBlank()) {
                            memberName = user.getFullName();
                        }
                    }
                } catch (Exception e) {
                    System.err.println("Could not fetch member details via AuthFeignClient: " + e.getMessage());
                }

                if (memberMobile == null || memberMobile.isBlank()) {
                    memberMobile = "+919876543210";
                }

                String messageText = String.format(
                    "💊 *CareCircle Medication Reminder*\n\nHello %s,\nIt's time to take your medication:\n• *Medicine*: %s\n• *Dosage*: %s\n• *Timing*: %s\n\nPlease log your dose in CareCircle App once taken!",
                    memberName, medicineName, dosage, foodRelation
                );

                NotificationRequest request = new NotificationRequest();
                request.setFamilyId(schedule.getFamilyId());
                request.setMemberId(schedule.getMemberId());
                request.setPhoneNumber(memberMobile);
                request.setNotificationType(NotificationType.MEDICINE_REMINDER);
                request.setReferenceId(schedule.getScheduleId());
                request.setMessage(messageText);

                notificationFeignClient.sendNotification(request);
                System.out.println("✅ Sent WhatsApp Medicine Reminder to " + memberMobile + " for " + medicineName);

            } catch (Exception ex) {
                System.err.println("Failed to process reminder " + reminder.getReminderId() + ": " + ex.getMessage());
            }
        }
    }
}