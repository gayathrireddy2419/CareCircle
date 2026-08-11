package com.carecircle.healthrecords.util;

import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

public class FileUtil {

    private FileUtil() {
    }

    public static String generateUniqueFileName(MultipartFile file) {

        return UUID.randomUUID() + "_"
                + file.getOriginalFilename();
    }

    public static boolean isFileEmpty(MultipartFile file) {

        return file == null || file.isEmpty();
    }

    public static String getExtension(String fileName) {

        if (fileName == null || !fileName.contains(".")) {
            return "";
        }

        return fileName.substring(fileName.lastIndexOf(".") + 1);
    }

}