package com.carecircle.medicine.service;

import java.util.List;
import java.util.UUID;

import com.carecircle.medicine.dto.request.MedicationScheduleRequest;
import com.carecircle.medicine.dto.response.MedicationScheduleResponse;

public interface MedicationScheduleService {

    MedicationScheduleResponse createMedicationSchedule(MedicationScheduleRequest request);

    MedicationScheduleResponse updateMedicationSchedule(UUID scheduleId,
            MedicationScheduleRequest request);

    void deleteMedicationSchedule(UUID scheduleId);

    MedicationScheduleResponse getMedicationScheduleById(UUID scheduleId);

    List<MedicationScheduleResponse> getMedicationSchedulesByMemberId(UUID memberId);

    List<MedicationScheduleResponse> getMedicationSchedulesByFamilyId(UUID familyId);

}