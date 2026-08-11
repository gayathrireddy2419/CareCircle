package com.carecircle.healthrecords.service;

import java.io.InputStream;

import org.springframework.web.multipart.MultipartFile;

public interface MinioService {

    String uploadFile(MultipartFile file);

    InputStream downloadFile(String objectName);

    void deleteFile(String objectName);

}