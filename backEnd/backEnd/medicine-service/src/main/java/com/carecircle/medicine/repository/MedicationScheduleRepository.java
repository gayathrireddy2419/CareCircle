package com.carecircle.medicine.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.carecircle.medicine.entity.MedicationSchedule;
import com.carecircle.medicine.enums.MedicationStatus;

@Repository
public interface MedicationScheduleRepository extends JpaRepository<MedicationSchedule, UUID> {

    List<MedicationSchedule> findByFamilyId(UUID familyId);

    List<MedicationSchedule> findByMemberId(UUID memberId);

    List<MedicationSchedule> findByStatus(MedicationStatus status);

    List<MedicationSchedule> findByMemberIdAndStatus(UUID memberId,
            MedicationStatus status);

    List<MedicationSchedule> findByStartDate(LocalDate startDate);

    List<MedicationSchedule> findByEndDate(LocalDate endDate);

    List<MedicationSchedule> findByInventoryId(UUID inventoryId);

}