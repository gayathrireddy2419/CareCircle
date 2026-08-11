package com.carecircle.healthrecords.controller;

import java.io.InputStream;
import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RequestParam;

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
    public ResponseEntity<ApiResponse<MedicalRecordResponse>> uploadRecord(
            @Valid @ModelAttribute UploadRecordRequest request,
            @RequestParam("file") MultipartFile file) {

        MedicalRecordResponse response =
                medicalRecordService.uploadRecord(request, file);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(
                        true,
                        "Medical record uploaded successfully.",
                        response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MedicalRecordResponse>>> getAllRecords() {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Medical records fetched successfully.",
                        medicalRecordService.getAllRecords()));
    }

    @GetMapping("/{recordId}")
    public ResponseEntity<ApiResponse<MedicalRecordResponse>> getRecordById(
            @PathVariable UUID recordId) {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Medical record fetched successfully.",
                        medicalRecordService.getRecordById(recordId)));
    }

    @GetMapping("/family/{familyId}")
    public ResponseEntity<ApiResponse<List<MedicalRecordResponse>>> getRecordsByFamily(
            @PathVariable UUID familyId) {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Family medical records fetched successfully.",
                        medicalRecordService.getRecordsByFamily(familyId)));
    }

    @GetMapping("/member/{memberId}")
    public ResponseEntity<ApiResponse<List<MedicalRecordResponse>>> getRecordsByMember(
            @PathVariable UUID memberId) {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Member medical records fetched successfully.",
                        medicalRecordService.getRecordsByMember(memberId)));
    }

    @GetMapping("/download/{recordId}")
    public ResponseEntity<InputStreamResource> downloadRecord(
            @PathVariable UUID recordId) {

        MedicalRecordResponse record = medicalRecordService.getRecordById(recordId);
        InputStream inputStream = medicalRecordService.downloadRecord(recordId);

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

    @DeleteMapping("/{recordId}")
    public ResponseEntity<ApiResponse<Void>> deleteRecord(
            @PathVariable UUID recordId) {

        medicalRecordService.deleteRecord(recordId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Medical record deleted successfully.",
                        null));
    }

}