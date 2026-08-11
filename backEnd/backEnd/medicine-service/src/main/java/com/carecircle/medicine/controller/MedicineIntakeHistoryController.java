package com.carecircle.medicine.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.carecircle.medicine.dto.request.MedicineIntakeHistoryRequest;
import com.carecircle.medicine.dto.response.MedicineIntakeHistoryResponse;
import com.carecircle.medicine.enums.IntakeStatus;
import com.carecircle.medicine.service.MedicineIntakeHistoryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/medicine-intake")
public class MedicineIntakeHistoryController {

    private final MedicineIntakeHistoryService medicineIntakeHistoryService;

    public MedicineIntakeHistoryController(
            MedicineIntakeHistoryService medicineIntakeHistoryService) {

        this.medicineIntakeHistoryService = medicineIntakeHistoryService;
    }

    /**
     * Record medicine intake.
     */
    @PostMapping("/{familyId}")
    public ResponseEntity<MedicineIntakeHistoryResponse> recordMedicineIntake(
            @PathVariable UUID familyId,
            @Valid @RequestBody MedicineIntakeHistoryRequest request) {

        return new ResponseEntity<>(
                medicineIntakeHistoryService.recordMedicineIntake(familyId, request),
                HttpStatus.CREATED);
    }

    /**
     * Get all intake history for a family.
     */
    @GetMapping("/family/{familyId}")
    public ResponseEntity<List<MedicineIntakeHistoryResponse>> getAllMedicineIntakeHistory(
            @PathVariable UUID familyId) {

        return ResponseEntity.ok(
                medicineIntakeHistoryService.getAllMedicineIntakeHistory(familyId));
    }

    /**
     * Get intake history by ID.
     */
    @GetMapping("/{intakeId}")
    public ResponseEntity<MedicineIntakeHistoryResponse> getMedicineIntakeById(
            @PathVariable UUID intakeId) {

        return ResponseEntity.ok(
                medicineIntakeHistoryService.getMedicineIntakeById(intakeId));
    }

    /**
     * Get intake history by member.
     */
    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<MedicineIntakeHistoryResponse>> getMedicineIntakeByMember(
            @PathVariable UUID memberId) {

        return ResponseEntity.ok(
                medicineIntakeHistoryService.getMedicineIntakeByMember(memberId));
    }

    /**
     * Get intake history by schedule.
     */
    @GetMapping("/schedule/{scheduleId}")
    public ResponseEntity<List<MedicineIntakeHistoryResponse>> getMedicineIntakeBySchedule(
            @PathVariable UUID scheduleId) {

        return ResponseEntity.ok(
                medicineIntakeHistoryService.getMedicineIntakeBySchedule(scheduleId));
    }

    /**
     * Get intake history by status.
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<MedicineIntakeHistoryResponse>> getMedicineIntakeByStatus(
            @PathVariable IntakeStatus status) {

        return ResponseEntity.ok(
                medicineIntakeHistoryService.getMedicineIntakeByStatus(status));
    }

    /**
     * Get intake history by intake date.
     */
    @GetMapping("/date/{intakeDate}")
    public ResponseEntity<List<MedicineIntakeHistoryResponse>> getMedicineIntakeByDate(
            @PathVariable
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate intakeDate) {

        return ResponseEntity.ok(
                medicineIntakeHistoryService.getMedicineIntakeByDate(intakeDate));
    }

    /**
     * Update intake history.
     */
    @PutMapping("/{intakeId}")
    public ResponseEntity<MedicineIntakeHistoryResponse> updateMedicineIntake(
            @PathVariable UUID intakeId,
            @Valid @RequestBody MedicineIntakeHistoryRequest request) {

        return ResponseEntity.ok(
                medicineIntakeHistoryService.updateMedicineIntake(intakeId, request));
    }

    /**
     * Delete intake history.
     */
    @DeleteMapping("/{intakeId}")
    public ResponseEntity<String> deleteMedicineIntake(
            @PathVariable UUID intakeId) {

        medicineIntakeHistoryService.deleteMedicineIntake(intakeId);

        return ResponseEntity.ok("Medicine intake history deleted successfully.");
    }
}