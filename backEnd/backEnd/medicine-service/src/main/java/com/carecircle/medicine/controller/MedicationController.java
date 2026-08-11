package com.carecircle.medicine.controller;

import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.carecircle.medicine.dto.request.MedicationReminderRequest;
import com.carecircle.medicine.dto.request.MedicationScheduleRequest;
import com.carecircle.medicine.dto.response.MedicationReminderResponse;
import com.carecircle.medicine.dto.response.MedicationScheduleResponse;
import com.carecircle.medicine.service.MedicationReminderService;
import com.carecircle.medicine.service.MedicationScheduleService;

import java.time.LocalDate;

import com.carecircle.medicine.dto.request.MedicineIntakeHistoryRequest;
import com.carecircle.medicine.dto.response.MedicineIntakeHistoryResponse;
import com.carecircle.medicine.enums.IntakeStatus;
import com.carecircle.medicine.service.MedicineIntakeHistoryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/medications")
@Validated
public class MedicationController {

    private final MedicationScheduleService medicationScheduleService;
    private final MedicationReminderService medicationReminderService;
    private final MedicineIntakeHistoryService medicineIntakeHistoryService;
    
    
    public MedicationController(
            MedicationScheduleService medicationScheduleService,
            MedicationReminderService medicationReminderService,
            MedicineIntakeHistoryService medicineIntakeHistoryService) {

        this.medicationScheduleService = medicationScheduleService;
        this.medicationReminderService = medicationReminderService;
        this.medicineIntakeHistoryService = medicineIntakeHistoryService;
    }

    // =====================================================
    // Medication Schedule APIs
    // =====================================================

    @PostMapping
    public ResponseEntity<MedicationScheduleResponse> createMedicationSchedule(
            @RequestParam UUID familyId,
            @Valid @RequestBody MedicationScheduleRequest request) {

    	MedicationScheduleResponse response =
    	        medicationScheduleService.createMedicationSchedule(
    	                request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<MedicationScheduleResponse>> getAllMedicationSchedules(
            @RequestParam UUID familyId) {

    	return ResponseEntity.ok(
    	        medicationScheduleService.getMedicationSchedulesByFamilyId(familyId));}

    @GetMapping("/{scheduleId}")
    public ResponseEntity<MedicationScheduleResponse> getMedicationScheduleById(
            @PathVariable UUID scheduleId) {

        return ResponseEntity.ok(
                medicationScheduleService.getMedicationScheduleById(scheduleId));
    }

    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<MedicationScheduleResponse>> getMedicationSchedulesByMember(
            @PathVariable UUID memberId) {

    	return ResponseEntity.ok(
    	        medicationScheduleService.getMedicationSchedulesByMemberId(memberId));}

    @PutMapping("/{scheduleId}")
    public ResponseEntity<MedicationScheduleResponse> updateMedicationSchedule(
            @PathVariable UUID scheduleId,
            @Valid @RequestBody MedicationScheduleRequest request) {

        return ResponseEntity.ok(
                medicationScheduleService.updateMedicationSchedule(
                        scheduleId,
                        request));
    }

    @DeleteMapping("/{scheduleId}")
    public ResponseEntity<Void> deleteMedicationSchedule(
            @PathVariable UUID scheduleId) {

        medicationScheduleService.deleteMedicationSchedule(scheduleId);

        return ResponseEntity.noContent().build();
    }

    // =====================================================
    // Medication Reminder APIs
    // =====================================================

    @PostMapping("/{scheduleId}/reminders")
    public ResponseEntity<MedicationReminderResponse> addMedicationReminder(
            @PathVariable UUID scheduleId,
            @Valid @RequestBody MedicationReminderRequest request) {

        MedicationReminderResponse response =
                medicationReminderService.addReminder(scheduleId, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{scheduleId}/reminders")
    public ResponseEntity<List<MedicationReminderResponse>> getMedicationReminders(
            @PathVariable UUID scheduleId) {

        return ResponseEntity.ok(
                medicationReminderService.getRemindersBySchedule(scheduleId));
    }

    @GetMapping("/reminders")
    public ResponseEntity<List<MedicationReminderResponse>> getMedicationRemindersByTime(
            @RequestParam LocalTime reminderTime) {

        return ResponseEntity.ok(
                medicationReminderService.getRemindersByTime(reminderTime));
    }

    @PutMapping("/reminders/{reminderId}")
    public ResponseEntity<MedicationReminderResponse> updateMedicationReminder(
            @PathVariable UUID reminderId,
            @Valid @RequestBody MedicationReminderRequest request) {

        return ResponseEntity.ok(
                medicationReminderService.updateReminder(reminderId, request));
    }

    @DeleteMapping("/reminders/{reminderId}")
    public ResponseEntity<Void> deleteMedicationReminder(
            @PathVariable UUID reminderId) {

        medicationReminderService.deleteReminder(reminderId);

        return ResponseEntity.noContent().build();
    }
    
    
 
 // Medicine Intake History APIs
 

 @PostMapping("/intake")
 public ResponseEntity<MedicineIntakeHistoryResponse> recordMedicineIntake(
         @RequestParam UUID familyId,
         @Valid @RequestBody MedicineIntakeHistoryRequest request) {

     MedicineIntakeHistoryResponse response =
             medicineIntakeHistoryService.recordMedicineIntake(
                     familyId,
                     request);

     return ResponseEntity.status(HttpStatus.CREATED).body(response);
 }
 
 @GetMapping("/intake")
 public ResponseEntity<List<MedicineIntakeHistoryResponse>> getAllMedicineIntakeHistory(
         @RequestParam UUID familyId) {

     return ResponseEntity.ok(
             medicineIntakeHistoryService.getAllMedicineIntakeHistory(
                     familyId));
 }
 
 @GetMapping("/intake/{intakeId}")
 public ResponseEntity<MedicineIntakeHistoryResponse> getMedicineIntakeById(
         @PathVariable UUID intakeId) {

     return ResponseEntity.ok(
             medicineIntakeHistoryService.getMedicineIntakeById(
                     intakeId));
 }
 
 @GetMapping("/intake/member/{memberId}")
 public ResponseEntity<List<MedicineIntakeHistoryResponse>> getMedicineIntakeByMember(
         @PathVariable UUID memberId) {

     return ResponseEntity.ok(
             medicineIntakeHistoryService.getMedicineIntakeByMember(
                     memberId));
 }
 
 @GetMapping("/intake/schedule/{scheduleId}")
 public ResponseEntity<List<MedicineIntakeHistoryResponse>> getMedicineIntakeBySchedule(
         @PathVariable UUID scheduleId) {

     return ResponseEntity.ok(
             medicineIntakeHistoryService.getMedicineIntakeBySchedule(
                     scheduleId));
 }
 
 @GetMapping("/intake/status")
 public ResponseEntity<List<MedicineIntakeHistoryResponse>> getMedicineIntakeByStatus(
         @RequestParam IntakeStatus status) {

     return ResponseEntity.ok(
             medicineIntakeHistoryService.getMedicineIntakeByStatus(
                     status));
 }
 
 @GetMapping("/intake/date")
 public ResponseEntity<List<MedicineIntakeHistoryResponse>> getMedicineIntakeByDate(
         @RequestParam LocalDate intakeDate) {

     return ResponseEntity.ok(
             medicineIntakeHistoryService.getMedicineIntakeByDate(
                     intakeDate));
 }
 
 @PutMapping("/intake/{intakeId}")
 public ResponseEntity<MedicineIntakeHistoryResponse> updateMedicineIntake(
         @PathVariable UUID intakeId,
         @Valid @RequestBody MedicineIntakeHistoryRequest request) {

     return ResponseEntity.ok(
             medicineIntakeHistoryService.updateMedicineIntake(
                     intakeId,
                     request));
 }
 
 @DeleteMapping("/intake/{intakeId}")
 public ResponseEntity<Void> deleteMedicineIntake(
         @PathVariable UUID intakeId) {

     medicineIntakeHistoryService.deleteMedicineIntake(
             intakeId);

     return ResponseEntity.noContent().build();
 }
 
 
}