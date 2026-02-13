package com.blog.controller;

import com.blog.service.PostService;
import com.blog.service.PostValidator;
import com.blog.service.UploadService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;
    private final PostValidator postValidator;
    private final UploadService uploadService;
    private final ObjectMapper objectMapper;

    public PostController(PostService postService, PostValidator postValidator, UploadService uploadService, ObjectMapper objectMapper) {
        this.postService = postService;
        this.postValidator = postValidator;
        this.uploadService = uploadService;
        this.objectMapper = objectMapper;
    }

    @GetMapping
    public ResponseEntity<?> list() {
        try {
            return ResponseEntity.ok(postService.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        try {
            var post = postService.findById(id);
            if (post == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Post not found"));
            }
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<?> getByCategory(@PathVariable String categoria) {
        try {
            return ResponseEntity.ok(postService.findByCategory(categoria));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> create(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String tags,
            @RequestParam(required = false) String excerpt,
            @RequestParam(required = false) String conteudo,
            @RequestParam(required = false) String readingTime,
            @RequestParam(required = false) MultipartFile image,
            HttpServletRequest request) {

        try {
            String imagePath = null;
            // Se houver arquivo de imagem, fazer upload
            if (image != null && !image.isEmpty()) {
                imagePath = uploadService.saveImage(image).orElse(null);
            } 
            // Se não houver arquivo, verificar se há imageUrl nos parâmetros
            else if (request instanceof MultipartHttpServletRequest multipartRequest) {
                String imageUrl = multipartRequest.getParameter("imageUrl");
                if (imageUrl != null && !imageUrl.isBlank()) {
                    imagePath = imageUrl;
                }
            }
            return createFromParams(title, category, tags, excerpt, conteudo, readingTime, imagePath);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createJson(@RequestBody Map<String, Object> body) {
        try {
            String imagePath = body.get("image") != null ? body.get("image").toString() : null;
            return createFromParams(
                    (String) body.get("title"),
                    (String) body.get("category"),
                    body.get("tags"),
                    (String) body.get("excerpt"),
                    body.get("conteudo"),
                    body.get("readingTime") != null ? body.get("readingTime").toString() : null,
                    imagePath
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    private ResponseEntity<?> createFromParams(Object title, Object category, Object tagsObj, Object excerpt,
                                                Object conteudoObj, Object readingTime, String imagePath) {
        List<Map<String, Object>> conteudo = parseConteudo(conteudoObj);
        List<String> tags = parseTags(tagsObj);

        var validation = postValidator.validateCreatePostData(title, category, tags, imagePath, excerpt, conteudo, readingTime);
        if (!validation.valid()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Validação falhou",
                    "details", validation.errors()
            ));
        }

        var sanitized = postValidator.sanitizeCreatePostData(
                title != null ? title.toString() : "",
                category != null ? category.toString() : "",
                tags,
                imagePath != null ? imagePath : "",
                excerpt != null ? excerpt.toString() : "",
                conteudo,
                readingTime != null ? readingTime.toString() : null
        );

        var post = postService.create(sanitized, imagePath);
        return ResponseEntity.status(HttpStatus.CREATED).body(post);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> update(
            @PathVariable String id,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String tags,
            @RequestParam(required = false) String excerpt,
            @RequestParam(required = false) String conteudo,
            @RequestParam(required = false) String readingTime,
            @RequestParam(required = false) MultipartFile image,
            HttpServletRequest request) {

        try {
            String imagePath = null;
            // Se houver arquivo de imagem, fazer upload
            if (image != null && !image.isEmpty()) {
                imagePath = uploadService.saveImage(image).orElse(null);
            } 
            // Se não houver arquivo, verificar se há imageUrl nos parâmetros
            else if (request instanceof MultipartHttpServletRequest multipartRequest) {
                String imageUrl = multipartRequest.getParameter("imageUrl");
                if (imageUrl != null && !imageUrl.isBlank()) {
                    imagePath = imageUrl;
                }
            }
            return updateFromParams(id, title, category, tags, excerpt, conteudo, readingTime, imagePath);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateJson(@PathVariable String id, @RequestBody Map<String, Object> body) {
        try {
            String imagePath = body.get("image") != null ? body.get("image").toString() : null;
            return updateFromParams(
                    id,
                    body.get("title") != null ? body.get("title").toString() : null,
                    body.get("category") != null ? body.get("category").toString() : null,
                    body.get("tags"),
                    body.get("excerpt") != null ? body.get("excerpt").toString() : null,
                    body.get("conteudo"),
                    body.get("readingTime") != null ? body.get("readingTime").toString() : null,
                    imagePath
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    private ResponseEntity<?> updateFromParams(String id, Object title, Object category, Object tagsObj,
                                                Object excerpt, Object conteudoObj, Object readingTime,
                                                String imagePath) {
        List<Map<String, Object>> conteudo = conteudoObj != null ? parseConteudo(conteudoObj) : null;
        List<String> tags = tagsObj != null ? parseTags(tagsObj) : null;

        var validation = postValidator.validateUpdatePostData(title, category, tags, imagePath, excerpt, conteudo, readingTime);
        if (!validation.valid()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Validação falhou",
                    "details", validation.errors()
            ));
        }

        var sanitized = postValidator.sanitizeUpdatePostData(
                title != null ? title.toString() : null,
                category != null ? category.toString() : null,
                tags,
                imagePath,
                excerpt != null ? excerpt.toString() : null,
                conteudo,
                readingTime != null ? readingTime.toString() : null
        );

        var post = postService.update(id, sanitized, imagePath);
        if (post == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Post não encontrado"));
        }
        return ResponseEntity.ok(post);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try {
            if (!postService.exists(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            postService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> parseConteudo(Object conteudoObj) {
        if (conteudoObj == null) return List.of();
        if (conteudoObj instanceof List) return (List<Map<String, Object>>) conteudoObj;
        if (conteudoObj instanceof Map) {
            Map<String, Object> map = (Map<String, Object>) conteudoObj;
            // Se tiver a chave "blocks", extrair a lista de lá
            if (map.containsKey("blocks") && map.get("blocks") instanceof List) {
                return (List<Map<String, Object>>) map.get("blocks");
            }
            // Se for um Map mas não tiver "blocks", retornar vazio ou tratar como erro
            return List.of();
        }
        if (conteudoObj instanceof String s) {
            try {
                Object parsed = objectMapper.readValue(s, Object.class);
                // Se o JSON parseado for um Map com "blocks"
                if (parsed instanceof Map) {
                    Map<String, Object> map = (Map<String, Object>) parsed;
                    if (map.containsKey("blocks") && map.get("blocks") instanceof List) {
                        return (List<Map<String, Object>>) map.get("blocks");
                    }
                }
                // Se for uma lista direta
                if (parsed instanceof List) {
                    return (List<Map<String, Object>>) parsed;
                }
                return List.of();
            } catch (Exception e) {
                throw new IllegalArgumentException("conteudo deve ser um JSON válido: " + e.getMessage());
            }
        }
        return List.of();
    }

    @SuppressWarnings("unchecked")
    private List<String> parseTags(Object tagsObj) {
        if (tagsObj == null) return List.of();
        if (tagsObj instanceof List) return (List<String>) tagsObj;
        if (tagsObj instanceof String s) {
            try {
                List<String> parsed = objectMapper.readValue(s, new TypeReference<>() {});
                if (parsed != null) return parsed;
            } catch (Exception ignored) {}
            return List.of(s.split(",")).stream().map(String::trim).filter(t -> !t.isEmpty()).toList();
        }
        return List.of();
    }
}
