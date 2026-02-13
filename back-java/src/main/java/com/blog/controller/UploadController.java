package com.blog.controller;

import com.blog.service.UploadService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    private final UploadService uploadService;

    public UploadController(UploadService uploadService) {
        this.uploadService = uploadService;
    }

    @PostMapping
    public ResponseEntity<?> upload(@RequestParam("image") MultipartFile image) {
        if (image == null || image.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No file uploaded"));
        }
        String imageUrl = uploadService.saveImage(image).orElse(null);
        if (imageUrl == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Falha ao salvar arquivo"));
        }
        String filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "imageUrl", imageUrl,
                "filename", filename
        ));
    }
}
