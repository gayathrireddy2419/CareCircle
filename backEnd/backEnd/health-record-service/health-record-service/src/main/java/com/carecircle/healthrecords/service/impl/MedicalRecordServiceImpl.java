package com.carecircle.healthrecords.service.impl;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.carecircle.healthrecords.document.MedicalRecord;
import com.carecircle.healthrecords.dto.request.UploadRecordRequest;
import com.carecircle.healthrecords.dto.response.MedicalRecordResponse;
import com.carecircle.healthrecords.repository.MedicalRecordRepository;
import com.carecircle.healthrecords.service.MedicalRecordService;
import com.carecircle.healthrecords.service.MinioService;

@Service
public class MedicalRecordServiceImpl implements MedicalRecordService {

    private final MedicalRecordRepository repository;
    private final MinioService minioService;

    public MedicalRecordServiceImpl(MedicalRecordRepository repository,
                                    MinioService minioService) {
        this.repository = repository;
        this.minioService = minioService;
    }

    @Override
    public MedicalRecordResponse uploadRecord(UploadRecordRequest request,
                                              MultipartFile file) {

        String objectKey = minioService.uploadFile(file);

        MedicalRecord record = new MedicalRecord();

        record.setTitle(request.getTitle());
        record.setDoctor(request.getDoctor());
        record.setDate(request.getDate());
        record.setCategory(request.getCategory());

        record.setFileName(file.getOriginalFilename());
        record.setObjectKey(objectKey);
        record.setContentType(file.getContentType());
        record.setFileSize(file.getSize());
        record.setUploadedAt(LocalDateTime.now());

        repository.save(record);

        return mapToResponse(record);
    }

    @Override
    public List<MedicalRecordResponse> getAllRecords() {

        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

    }

    @Override
    public MedicalRecordResponse getRecordById(String id) {

        MedicalRecord record = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));

        return mapToResponse(record);

    }

    @Override
    public InputStream downloadRecord(String id) {

        MedicalRecord record = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));

        return minioService.downloadFile(record.getObjectKey());

    }

    @Override
    public void deleteRecord(String id) {

        MedicalRecord record = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));

        minioService.deleteFile(record.getObjectKey());

        repository.delete(record);

    }

    private MedicalRecordResponse mapToResponse(MedicalRecord record) {

        MedicalRecordResponse response = new MedicalRecordResponse();

        response.setId(record.getId());
        response.setTitle(record.getTitle());
        response.setDoctor(record.getDoctor());
        response.setDate(record.getDate());
        response.setCategory(record.getCategory());
        response.setFileName(record.getFileName());
        response.setObjectKey(record.getObjectKey());
        response.setContentType(record.getContentType());
        response.setFileSize(record.getFileSize());
        response.setUploadedAt(record.getUploadedAt());

        return response;
    }

}