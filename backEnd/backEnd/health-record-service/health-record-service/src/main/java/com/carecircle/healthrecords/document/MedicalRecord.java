package com.carecircle.healthrecords.document;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "medical_records")
public class MedicalRecord {

    @Id
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