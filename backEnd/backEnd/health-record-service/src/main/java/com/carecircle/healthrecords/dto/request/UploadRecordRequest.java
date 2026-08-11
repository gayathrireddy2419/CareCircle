package com.carecircle.healthrecords.dto.request;

import java.time.LocalDate;
import java.util.UUID;

import com.carecircle.healthrecords.document.RecordCategory;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class UploadRecordRequest {

    @NotNull(message = "Family ID is required")
    private UUID familyId;

    @NotNull(message = "Member ID is required")
    private UUID memberId;

    @NotBlank(message = "Title is required")
    private String title;

    private String doctor;

    @NotNull(message = "Record date is required")
    private LocalDate recordDate;

    @NotNull(message = "Category is required")
    private RecordCategory category;

    public UploadRecordRequest() {
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDoctor() {
        return doctor;
    }

    public void setDoctor(String doctor) {
        this.doctor = doctor;
    }

    public LocalDate getRecordDate() {
        return recordDate;
    }

    public void setRecordDate(LocalDate recordDate) {
        this.recordDate = recordDate;
    }

    public RecordCategory getCategory() {
        return category;
    }

    public void setCategory(RecordCategory category) {
        this.category = category;
    }
}