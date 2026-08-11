package com.carecircle.healthrecords.service.impl;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.carecircle.healthrecords.client.AuthFeignClient;
import com.carecircle.healthrecords.client.NotificationFeignClient;
import com.carecircle.healthrecords.document.MedicalRecord;
import com.carecircle.healthrecords.dto.request.NotificationRequest;
import com.carecircle.healthrecords.dto.request.UploadRecordRequest;
import com.carecircle.healthrecords.dto.response.InternalUserResponse;
import com.carecircle.healthrecords.dto.response.MedicalRecordResponse;
import com.carecircle.healthrecords.dto.request.*;
import com.carecircle.healthrecords.exception.FileStorageException;
import com.carecircle.healthrecords.repository.MedicalRecordRepository;
import com.carecircle.healthrecords.service.MedicalRecordService;
import com.carecircle.healthrecords.service.MinioService;

@Service
public class MedicalRecordServiceImpl implements MedicalRecordService {

    private final MedicalRecordRepository repository;
    private final MinioService minioService;
    private final AuthFeignClient authFeignClient;
    private final NotificationFeignClient notificationFeignClient;

    public MedicalRecordServiceImpl(
            MedicalRecordRepository repository,
            MinioService minioService,
            AuthFeignClient authFeignClient,
            NotificationFeignClient notificationFeignClient) {

        this.repository = repository;
        this.minioService = minioService;
        this.authFeignClient = authFeignClient;
        this.notificationFeignClient = notificationFeignClient;
    }

    // ============================================================
    // UPLOAD MEDICAL RECORD
    // ============================================================

    @Override
    public MedicalRecordResponse uploadRecord(
            UploadRecordRequest request,
            MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new FileStorageException("Medical record file is required.");
        }

        /*
         * --------------------------------------------------------
         * 1. Verify member through Authentication Service
         * --------------------------------------------------------
         */

        InternalUserResponse user;

        try {

            user = authFeignClient.getInternalUser(
                    request.getMemberId());

        } catch (Exception e) {

            throw new FileStorageException(
                    "Unable to verify member with Authentication Service.");
        }

        if (user == null) {
            throw new FileStorageException(
                    "Member not found in Authentication Service.");
        }

        /*
         * Make sure the member actually belongs to the
         * family supplied in the request.
         */

        if (user.getFamilyId() == null ||
                !user.getFamilyId().equals(request.getFamilyId())) {

            throw new FileStorageException(
                    "Member does not belong to the specified family.");
        }

        /*
         * --------------------------------------------------------
         * 2. Upload file to MinIO
         * --------------------------------------------------------
         */

        String objectKey;

        try {

            objectKey = minioService.uploadFile(file);

        } catch (Exception e) {

            throw new FileStorageException(
                    "Failed to upload medical record to storage.");
        }

        /*
         * --------------------------------------------------------
         * 3. Create MongoDB document
         * --------------------------------------------------------
         */

        MedicalRecord record = new MedicalRecord();

        UUID recordId = UUID.randomUUID();

        record.setRecordId(recordId);

        record.setFamilyId(user.getFamilyId());
        record.setMemberId(user.getUserId());

        record.setTitle(request.getTitle());
        record.setDoctor(request.getDoctor());
        record.setRecordDate(request.getRecordDate());
        record.setCategory(request.getCategory());

        record.setFileName(file.getOriginalFilename());
        record.setObjectKey(objectKey);
        record.setContentType(file.getContentType());
        record.setFileSize(file.getSize());

        record.setActive(true);

        record.setUploadedAt(LocalDateTime.now());
        record.setUpdatedAt(LocalDateTime.now());

        repository.save(record);

        /*
         * --------------------------------------------------------
         * 4. Send notification
         * --------------------------------------------------------
         */

        sendUploadNotification(
                user,
                record);

        /*
         * --------------------------------------------------------
         * 5. Return response
         * --------------------------------------------------------
         */

        return mapToResponse(record);
    }

    // ============================================================
    // GET ALL RECORDS
    // ============================================================

    @Override
    public List<MedicalRecordResponse> getAllRecords() {

        return repository.findAll()
                .stream()
                .filter(MedicalRecord::isActive)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ============================================================
    // GET RECORD BY ID
    // ============================================================

    @Override
    public MedicalRecordResponse getRecordById(UUID recordId) {

        MedicalRecord record = repository.findById(recordId)
                .orElseThrow(() ->
                        new FileStorageException(
                                "Medical record not found."));

        if (!record.isActive()) {
            throw new FileStorageException(
                    "Medical record is no longer active.");
        }

        return mapToResponse(record);
    }

    // ============================================================
    // GET RECORDS BY FAMILY
    // ============================================================

    @Override
    public List<MedicalRecordResponse> getRecordsByFamily(
            UUID familyId) {

        return repository.findByFamilyIdAndActiveTrue(familyId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ============================================================
    // GET RECORDS BY MEMBER
    // ============================================================

    @Override
    public List<MedicalRecordResponse> getRecordsByMember(
            UUID memberId) {

        return repository.findByMemberIdAndActiveTrue(memberId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ============================================================
    // DOWNLOAD RECORD
    // ============================================================

    @Override
    public InputStream downloadRecord(UUID recordId) {

        MedicalRecord record = repository.findById(recordId)
                .orElseThrow(() ->
                        new FileStorageException(
                                "Medical record not found."));

        if (!record.isActive()) {
            throw new FileStorageException(
                    "Medical record is no longer active.");
        }

        return minioService.downloadFile(
                record.getObjectKey());
    }

    // ============================================================
    // DELETE RECORD
    // ============================================================

    @Override
    public void deleteRecord(UUID recordId) {

        MedicalRecord record = repository.findById(recordId)
                .orElseThrow(() ->
                        new FileStorageException(
                                "Medical record not found."));

        if (!record.isActive()) {
            throw new FileStorageException(
                    "Medical record is already deleted.");
        }

        /*
         * --------------------------------------------------------
         * Get member information before soft deletion
         * --------------------------------------------------------
         */

        InternalUserResponse user = null;

        try {

            user = authFeignClient.getInternalUser(
                    record.getMemberId());

        } catch (Exception e) {

            System.out.println(
                    "Unable to retrieve member information " +
                    "for delete notification.");
        }

        /*
         * --------------------------------------------------------
         * Delete associated file from MinIO Storage Server
         * --------------------------------------------------------
         */

        String objectKey = record.getObjectKey();

        if (objectKey != null && !objectKey.isBlank()) {
            minioService.deleteFile(objectKey);
        }

        /*
         * --------------------------------------------------------
         * Soft delete MongoDB record
         * --------------------------------------------------------
         */

        record.setActive(false);
        record.setUpdatedAt(LocalDateTime.now());

        repository.save(record);

        /*
         * --------------------------------------------------------
         * Send deletion notification
         * --------------------------------------------------------
         */

        if (user != null) {

            sendDeleteNotification(
                    user,
                    record);
        }
    }

    // ============================================================
    // UPLOAD NOTIFICATION
    // ============================================================

    private void sendUploadNotification(
            InternalUserResponse user,
            MedicalRecord record) {

        if (user.getMobileNumber() == null ||
                user.getMobileNumber().isBlank()) {

            return;
        }

        NotificationRequest request =
                new NotificationRequest();

        request.setFamilyId(
                user.getFamilyId());

        request.setMemberId(
                user.getUserId());

        request.setPhoneNumber(
                user.getMobileNumber());

        request.setNotificationType(
                NotificationType.RECORD_UPLOAD);

        request.setReferenceId(
                record.getRecordId());

        String message =
                "Hello " + user.getFullName()
                + ", your medical record '"
                + record.getTitle()
                + "' has been uploaded successfully to CareCircle.";

        request.setMessage(message);

        try {

            notificationFeignClient.sendNotification(
                    request);

        } catch (Exception e) {

            /*
             * The medical record is already safely stored.
             * Notification failure should not make the upload
             * appear unsuccessful.
             */

            System.out.println(
                    "Notification Service unavailable. " +
                    "Medical record was saved successfully.");

            e.printStackTrace();
        }
    }

    // ============================================================
    // DELETE NOTIFICATION
    // ============================================================

    private void sendDeleteNotification(
            InternalUserResponse user,
            MedicalRecord record) {

        if (user.getMobileNumber() == null ||
                user.getMobileNumber().isBlank()) {

            return;
        }

        NotificationRequest request =
                new NotificationRequest();

        request.setFamilyId(
                user.getFamilyId());

        request.setMemberId(
                user.getUserId());

        request.setPhoneNumber(
                user.getMobileNumber());

        request.setNotificationType(
                NotificationType.RECORD_DELETE);

        request.setReferenceId(
                record.getRecordId());

        String message =
                "Hello " + user.getFullName()
                + ", your medical record '"
                + record.getTitle()
                + "' has been deleted from CareCircle.";

        request.setMessage(message);

        try {

            notificationFeignClient.sendNotification(
                    request);

        } catch (Exception e) {

            System.out.println(
                    "Notification Service unavailable. " +
                    "Medical record deletion was completed.");

            e.printStackTrace();
        }
    }

    // ============================================================
    // MAP DOCUMENT → RESPONSE
    // ============================================================

    private MedicalRecordResponse mapToResponse(
            MedicalRecord record) {

        MedicalRecordResponse response =
                new MedicalRecordResponse();

        response.setRecordId(
                record.getRecordId());

        response.setFamilyId(
                record.getFamilyId());

        response.setMemberId(
                record.getMemberId());

        response.setTitle(
                record.getTitle());

        response.setDoctor(
                record.getDoctor());

        response.setRecordDate(
                record.getRecordDate());

        response.setCategory(
                record.getCategory());

        response.setFileName(
                record.getFileName());

        response.setObjectKey(
                record.getObjectKey());

        response.setContentType(
                record.getContentType());

        response.setFileSize(
                record.getFileSize());

        response.setUploadedAt(
                record.getUploadedAt());

        return response;
    }
}