package com.carecircle.healthrecords.service.impl;

import java.io.InputStream;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.carecircle.healthrecords.exception.FileStorageException;
import com.carecircle.healthrecords.service.MinioService;

import io.minio.BucketExistsArgs;
import io.minio.GetObjectArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;

@Service
public class MinioServiceImpl implements MinioService {

    private final MinioClient minioClient;

    @Value("${minio.bucket}")
    private String bucketName;

    public MinioServiceImpl(MinioClient minioClient) {
        this.minioClient = minioClient;
    }

    @Override
    public String uploadFile(MultipartFile file) {

        try {

            if (file == null || file.isEmpty()) {
                throw new FileStorageException("Uploaded file is empty.");
            }

            createBucketIfNotExists();

            String originalName = file.getOriginalFilename();

            if (originalName == null || originalName.isBlank()) {
                originalName = "document";
            }

            String objectName =
                    UUID.randomUUID() + "_" + originalName;

            minioClient.putObject(

                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .stream(
                                    file.getInputStream(),
                                    file.getSize(),
                                    -1)
                            .contentType(file.getContentType())
                            .build());

            return objectName;

        } catch (Exception e) {

            throw new FileStorageException("Failed to upload file.", e);

        }

    }

    @Override
    public InputStream downloadFile(String objectName) {

        try {

            return minioClient.getObject(

                    GetObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .build());

        } catch (Exception e) {

            throw new FileStorageException("Failed to download file.", e);

        }

    }

    @Override
    public void deleteFile(String objectName) {

        if (objectName == null || objectName.isBlank()) {
            return;
        }

        try {

            String cleanObjectName = extractPureObjectKey(objectName);

            minioClient.removeObject(

                    RemoveObjectArgs.builder()
                            .bucket(bucketName)
                            .object(cleanObjectName)
                            .build());

        } catch (Exception e) {

            throw new FileStorageException("Failed to delete file from MinIO storage.", e);

        }

    }

    private String extractPureObjectKey(String rawPath) {
        if (rawPath == null || rawPath.isBlank()) {
            return rawPath;
        }
        String clean = rawPath.trim();

        // Extract filename if full HTTP URL was passed
        if (clean.startsWith("http://") || clean.startsWith("https://")) {
            int lastSlashIdx = clean.lastIndexOf('/');
            if (lastSlashIdx != -1 && lastSlashIdx < clean.length() - 1) {
                clean = clean.substring(lastSlashIdx + 1);
            }
        }

        // Remove query parameters if present
        int queryIdx = clean.indexOf('?');
        if (queryIdx != -1) {
            clean = clean.substring(0, queryIdx);
        }

        // Strip leading slash
        if (clean.startsWith("/")) {
            clean = clean.substring(1);
        }

        // Strip bucket name prefix if present
        if (bucketName != null && !bucketName.isBlank() && clean.startsWith(bucketName + "/")) {
            clean = clean.substring(bucketName.length() + 1);
        }

        return clean;
    }

    private void createBucketIfNotExists() throws Exception {

        boolean exists = minioClient.bucketExists(

                BucketExistsArgs.builder()
                        .bucket(bucketName)
                        .build());

        if (!exists) {

            minioClient.makeBucket(

                    MakeBucketArgs.builder()
                            .bucket(bucketName)
                            .build());
        }
    }
}