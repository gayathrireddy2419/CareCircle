package com.carecircle.healthrecords.service.impl;

import java.io.InputStream;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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

            boolean found = minioClient.bucketExists(
                    BucketExistsArgs.builder()
                            .bucket(bucketName)
                            .build());

            if (!found) {

                minioClient.makeBucket(
                        MakeBucketArgs.builder()
                                .bucket(bucketName)
                                .build());

            }

            String objectName =
                    UUID.randomUUID()
                            + "_"
                            + file.getOriginalFilename();

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

            throw new RuntimeException("File upload failed : " + e.getMessage());

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

            throw new RuntimeException("Download failed : " + e.getMessage());

        }

    }

    @Override
    public void deleteFile(String objectName) {

        try {

            minioClient.removeObject(

                    RemoveObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .build());

        } catch (Exception e) {

            throw new RuntimeException("Delete failed : " + e.getMessage());

        }

    }

}