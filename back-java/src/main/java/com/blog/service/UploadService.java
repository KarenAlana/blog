package com.blog.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.UUID;

@Service
public class UploadService {

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final String[] ALLOWED_MIMES = {
            "image/jpeg", "image/png", "image/webp", "image/gif"
    };

    private final Path uploadDir;

    public UploadService(@Value("${app.upload-dir:uploads}") String uploadDirName) {
        this.uploadDir = Paths.get(uploadDirName).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Não foi possível criar pasta de uploads", e);
        }
    }

    public Optional<String> saveImage(MultipartFile file) {
        if (file == null || file.isEmpty()) return Optional.empty();

        String contentType = file.getContentType();
        if (contentType == null || !isAllowedMime(contentType)) {
            throw new IllegalArgumentException("Tipo de arquivo inválido. Apenas JPEG, PNG, WEBP e GIF são permitidos.");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("Arquivo muito grande. Máximo 5MB.");
        }

        String ext = getExtension(file.getOriginalFilename(), contentType);
        String filename = System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 7) + ext;

        try {
            Path target = uploadDir.resolve(filename);
            file.transferTo(target);
            return Optional.of("/uploads/" + filename);
        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar arquivo", e);
        }
    }

    private boolean isAllowedMime(String mime) {
        for (String allowed : ALLOWED_MIMES) {
            if (allowed.equals(mime)) return true;
        }
        return false;
    }

    private String getExtension(String originalFilename, String contentType) {
        if (originalFilename != null && originalFilename.contains(".")) {
            int i = originalFilename.lastIndexOf('.');
            return originalFilename.substring(i);
        }
        if (contentType != null) {
            return switch (contentType) {
                case "image/png" -> ".png";
                case "image/webp" -> ".webp";
                case "image/gif" -> ".gif";
                default -> ".jpg";
            };
        }
        return ".jpg";
    }
}
