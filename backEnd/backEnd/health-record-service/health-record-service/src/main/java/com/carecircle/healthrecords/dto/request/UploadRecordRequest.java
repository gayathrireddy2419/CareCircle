package com.carecircle.healthrecords.dto.request;

import java.time.LocalDate;

import lombok.Data;

@Data
public class UploadRecordRequest {

    private String title;

    private String doctor;

    private LocalDate date;

    private String category;

}