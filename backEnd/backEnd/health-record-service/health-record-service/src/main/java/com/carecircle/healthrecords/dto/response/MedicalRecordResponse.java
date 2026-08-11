package com.carecircle.healthrecords.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class MedicalRecordResponse {

    private String id;

    private String title;

    private String doctor;

    private LocalDate date;

    private String category;

    private String fileName;

    private String objectKey;

    private String contentType;

    private long fileSize;

    private LocalDateTime uploadedAt;

}