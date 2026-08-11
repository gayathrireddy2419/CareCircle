package com.carecircle.medicine.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import com.carecircle.medicine.enums.IntakeStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "medicine_intake_history")
public class MedicineIntakeHistory {

    @Id
    @GeneratedValue
    @Column(name = "intake_id", nullable = false, updatable = false)
    private UUID intakeId;

    @Column(name = "schedule_id", nullable = false)
    private UUID scheduleId;

    @Column(name = "reminder_id", nullable = true)
    private UUID reminderId;

    @Column(name = "family_id", nullable = false)
    private UUID familyId;

    @Column(name = "member_id", nullable = false)
    private UUID memberId;

    @Column(name = "intake_date", nullable = false)
    private LocalDate intakeDate;

    @Column(name = "reminder_time", nullable = true)
    private LocalTime reminderTime;

    @Column(name = "taken_time")
    private LocalDateTime takenTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private IntakeStatus status;

    @Column(name = "remarks")
    private String remarks;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public MedicineIntakeHistory() {
    }

    public UUID getIntakeId() {
        return intakeId;
    }

    public void setIntakeId(UUID intakeId) {
        this.intakeId = intakeId;
    }

    public UUID getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(UUID scheduleId) {
        this.scheduleId = scheduleId;
    }

    public UUID getReminderId() {
        return reminderId;
    }

    public void setReminderId(UUID reminderId) {
        this.reminderId = reminderId;
    }

    public UUID getFamilyId() {
        return familyId;
    }

    public void setFamilyId(UUID familyId) {
        this.familyId = familyId;
    }

    public UUID getMemberId() {
        return memberId;
    }

    public void setMemberId(UUID memberId) {
        this.memberId = memberId;
    }

    public LocalDate getIntakeDate() {
        return intakeDate;
    }

    public void setIntakeDate(LocalDate intakeDate) {
        this.intakeDate = intakeDate;
    }

    public LocalTime getReminderTime() {
        return reminderTime;
    }

    public void setReminderTime(LocalTime reminderTime) {
        this.reminderTime = reminderTime;
    }

    public LocalDateTime getTakenTime() {
        return takenTime;
    }

    public void setTakenTime(LocalDateTime takenTime) {
        this.takenTime = takenTime;
    }

    public IntakeStatus getStatus() {
        return status;
    }

    public void setStatus(IntakeStatus status) {
        this.status = status;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}