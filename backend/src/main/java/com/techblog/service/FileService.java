package com.techblog.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@Service
public class FileService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String uploadFile(MultipartFile file) {

        try {
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

            // ✅ Ensure directory exists
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            // ✅ FIXED PATH (important)
            File destination = new File(dir, fileName);

            file.transferTo(destination);

            return fileName;

        } catch (IOException e) {
            e.printStackTrace(); // 🔥 helpful for debugging
            throw new RuntimeException("File upload failed: " + e.getMessage());
        }
    }
}