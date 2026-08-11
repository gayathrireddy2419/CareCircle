package com.carecircle.medicine.service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import com.carecircle.medicine.dto.request.MedicineIntakeHistoryRequest;
import com.carecircle.medicine.dto.response.MedicineIntakeHistoryResponse;
import com.carecircle.medicine.enums.IntakeStatus;

public interface MedicineIntakeHistoryService {

    MedicineIntakeHistoryResponse recordMedicineIntake(
            UUID familyId,
            MedicineIntakeHistoryRequest request);

    List<MedicineIntakeHistoryResponse> getAllMedicineIntakeHistory(
            UUID familyId);

    MedicineIntakeHistoryResponse getMedicineIntakeById(
            UUID intakeId);

    List<MedicineIntakeHistoryResponse> getMedicineIntakeByMember(
            UUID memberId);

    List<MedicineIntakeHistoryResponse> getMedicineIntakeBySchedule(
            UUID scheduleId);

    List<MedicineIntakeHistoryResponse> getMedicineIntakeByStatus(
            IntakeStatus status);

    List<MedicineIntakeHistoryResponse> getMedicineIntakeByDate(
            LocalDate intakeDate);

    MedicineIntakeHistoryResponse updateMedicineIntake(
            UUID intakeId,
            MedicineIntakeHistoryRequest request);

    void deleteMedicineIntake(
            UUID intakeId);

}