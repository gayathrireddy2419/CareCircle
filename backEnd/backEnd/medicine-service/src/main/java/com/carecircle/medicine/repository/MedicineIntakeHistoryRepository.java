package com.carecircle.medicine.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.carecircle.medicine.entity.MedicineIntakeHistory;
import com.carecircle.medicine.enums.IntakeStatus;

@Repository
public interface MedicineIntakeHistoryRepository extends JpaRepository<MedicineIntakeHistory, UUID> {

    List<MedicineIntakeHistory> findByMemberId(UUID memberId);

    List<MedicineIntakeHistory> findByScheduleId(UUID scheduleId);

    List<MedicineIntakeHistory> findByFamilyId(UUID familyId);

    List<MedicineIntakeHistory> findByStatus(IntakeStatus status);

    List<MedicineIntakeHistory> findByIntakeDate(LocalDate intakeDate);

    List<MedicineIntakeHistory> findByMemberIdAndStatus(UUID memberId,
                                                        IntakeStatus status);

    List<MedicineIntakeHistory> findByMemberIdAndIntakeDate(UUID memberId,
                                                            LocalDate intakeDate);

}