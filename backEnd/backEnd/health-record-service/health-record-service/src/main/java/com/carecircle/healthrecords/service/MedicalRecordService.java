package com.carecircle.healthrecords.service;

import java.io.InputStream;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.carecircle.healthrecords.dto.request.UploadRecordRequest;
import com.carecircle.healthrecords.dto.response.MedicalRecordResponse;

public interface MedicalRecordService {

    MedicalRecordResponse uploadRecord(UploadRecordRequest request, MultipartFile file);

    List<MedicalRecordResponse> getAllRecords();

    MedicalRecordResponse getRecordById(String id);

    InputStream downloadRecord(String id);

    void deleteRecord(String id);

}