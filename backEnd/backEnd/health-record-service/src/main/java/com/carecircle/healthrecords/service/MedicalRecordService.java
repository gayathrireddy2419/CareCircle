package com.carecircle.healthrecords.service;

import java.io.InputStream;
import java.util.List;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import com.carecircle.healthrecords.dto.request.UploadRecordRequest;
import com.carecircle.healthrecords.dto.response.MedicalRecordResponse;

public interface MedicalRecordService {

    MedicalRecordResponse uploadRecord(UploadRecordRequest request, MultipartFile file);

    List<MedicalRecordResponse> getAllRecords();

    MedicalRecordResponse getRecordById(UUID recordId);

    List<MedicalRecordResponse> getRecordsByFamily(UUID familyId);

    List<MedicalRecordResponse> getRecordsByMember(UUID memberId);

    InputStream downloadRecord(UUID recordId);

    void deleteRecord(UUID recordId);

}