package com.carecircle.healthrecords.controller;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.carecircle.healthrecords.dto.request.UploadRecordRequest;
import com.carecircle.healthrecords.dto.response.ApiResponse;
import com.carecircle.healthrecords.dto.response.MedicalRecordResponse;
import com.carecircle.healthrecords.service.MedicalRecordService;

@RestController
@RequestMapping("/api/records")
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    public MedicalRecordController(MedicalRecordService medicalRecordService) {
        this.medicalRecordService = medicalRecordService;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MedicalRecordResponse> uploadRecord(
            @ModelAttribute UploadRecordRequest request,
            @RequestParam("file") MultipartFile file) {

        return ResponseEntity.ok(
                medicalRecordService.uploadRecord(request, file));
    }

    @GetMapping
    public ResponseEntity<List<MedicalRecordResponse>> getAllRecords() {

        return ResponseEntity.ok(
                medicalRecordService.getAllRecords());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalRecordResponse> getRecordById(
            @PathVariable String id) {

        return ResponseEntity.ok(
                medicalRecordService.getRecordById(id));
    }

    @GetMapping("/download/{recordId}")
    public ResponseEntity<InputStreamResource> downloadRecord(
            @PathVariable UUID recordId) {

        MedicalRecordResponse record = medicalRecordService.getRecordById(recordId.toString());
        InputStream inputStream = medicalRecordService.downloadRecord(recordId.toString());

        String contentType = record != null ? record.getContentType() : null;
        if (contentType == null || contentType.isBlank()) {
            contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }

        String fileName = record != null ? record.getFileName() : null;
        if (fileName == null || fileName.isBlank()) {
            fileName = "medical-record";
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + fileName + "\"")
                .contentType(MediaType.parseMediaType(contentType))
                .body(new InputStreamResource(inputStream));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteRecord(
            @PathVariable String id) {

        medicalRecordService.deleteRecord(id);

        return ResponseEntity.ok(
                new ApiResponse(true,
                        "Record deleted successfully"));
    }

}