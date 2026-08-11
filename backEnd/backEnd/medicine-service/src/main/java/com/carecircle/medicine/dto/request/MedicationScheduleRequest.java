package com.carecircle.medicine.dto.request;

import java.time.LocalDate;
import java.util.UUID;

import com.carecircle.medicine.enums.Frequency;
import com.carecircle.medicine.enums.MedicationStatus;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class MedicationScheduleRequest {

    @NotNull(message = "Member ID is required")
    private UUID memberId;

    @NotNull(message = "Inventory ID is required")
    private UUID inventoryId;

    @NotNull(message = "Dosage is required")
    @Size(max = 50)
    private String dosage;

    @NotNull(message = "Frequency is required")
    private Frequency frequency;

    private Boolean beforeFood;
    
    @NotNull(message = "Family ID is required.")
    private UUID familyId;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    private LocalDate endDate;

    @Size(max = 300)
    private String instructions;

    @NotNull(message = "Status is required")
    private MedicationStatus status;

    public MedicationScheduleRequest() {
    }

    public UUID getMemberId() {
        return memberId;
    }

    public void setMemberId(UUID memberId) {
        this.memberId = memberId;
    }

    public UUID getInventoryId() {
        return inventoryId;
    }

    public void setInventoryId(UUID inventoryId) {
        this.inventoryId = inventoryId;
    }

    public String getDosage() {
        return dosage;
    }

    public void setDosage(String dosage) {
        this.dosage = dosage;
    }

    public Frequency getFrequency() {
        return frequency;
    }

    public void setFrequency(Frequency frequency) {
        this.frequency = frequency;
    }

    public Boolean getBeforeFood() {
        return beforeFood;
    }

    public void setBeforeFood(Boolean beforeFood) {
        this.beforeFood = beforeFood;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    public MedicationStatus getStatus() {
        return status;
    }

    public void setStatus(MedicationStatus status) {
        this.status = status;
    }
    
    public UUID getFamilyId() {
        return familyId;
    }

    public void setFamilyId(UUID familyId) {
        this.familyId = familyId;
    }
}