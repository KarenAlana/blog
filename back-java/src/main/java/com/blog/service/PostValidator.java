package com.blog.service;

import com.blog.model.CreatePostRequest;
import com.blog.model.UpdatePostRequest;
import org.springframework.stereotype.Service;


import java.util.Map;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostValidator {

    private final ContentService contentService;

    public PostValidator(ContentService contentService) {
        this.contentService = contentService;
    }

    public ValidationResult validateCreatePostData(Object title, Object category, Object tags,
                                                   Object image, Object excerpt, Object conteudo, Object readingTime) {
        List<String> errors = new ArrayList<>();

        if (title == null || !(title instanceof String) || ((String) title).trim().isEmpty()) {
            errors.add("title é obrigatório e deve ser string");
        } else if (((String) title).length() > 200) {
            errors.add("title não pode ter mais de 200 caracteres");
        }

        if (category == null || !(category instanceof String)) {
            errors.add("category é obrigatória e deve ser string");
        } else if (!contentService.isValidCategory((String) category)) {
            errors.add("category deve ser uma das opções válidas");
        }

        if (tags != null) {
            if (!(tags instanceof List)) {
                errors.add("tags deve ser um array");
            } else if (((List<?>) tags).size() > 20) {
                errors.add("tags não pode ter mais de 20 itens");
            } else if (((List<?>) tags).stream().anyMatch(t -> !(t instanceof String))) {
                errors.add("todas as tags devem ser strings");
            }
        }

        if (image == null || (image instanceof String && ((String) image).isBlank())) {
            errors.add("image é obrigatória (URL ou arquivo)");
        } else if (image instanceof String && ((String) image).length() > 500) {
            errors.add("URL da image não pode ter mais de 500 caracteres");
        }

        if (excerpt == null || !(excerpt instanceof String) || ((String) excerpt).trim().isEmpty()) {
            errors.add("excerpt é obrigatória e deve ser string");
        } else if (((String) excerpt).length() > 500) {
            errors.add("excerpt não pode ter mais de 500 caracteres");
        }

        if (conteudo == null) {
            errors.add("conteudo é obrigatório");
        } else if (!(conteudo instanceof List)) {
            errors.add("conteudo deve ser um array");
        } else {
            @SuppressWarnings("unchecked")
            List<Object> list = (List<Object>) conteudo;
            if (list.isEmpty()) {
                errors.add("conteudo deve ter pelo menos um bloco");
            } else {
                List<Map<String, Object>> blocks = list.stream()
                        .filter(m -> m instanceof Map)
                        .map(m -> (Map<String, Object>) m)
                        .collect(Collectors.toList());
                // Validação de blocos de conteúdo desligada – aceita qualquer estrutura
                // if (blocks.size() != list.size() || !contentService.validateContentBlocks(blocks)) {
                //     errors.add("alguns blocos de conteudo são inválidos");
                // }
            }
        }

        if (readingTime != null && !(readingTime instanceof String)) {
            errors.add("readingTime deve ser string");
        }

        return new ValidationResult(errors.isEmpty(), errors);
    }

    public ValidationResult validateUpdatePostData(Object title, Object category, Object tags,
                                                   Object image, Object excerpt, Object conteudo, Object readingTime) {
        List<String> errors = new ArrayList<>();

        if (title != null) {
            if (!(title instanceof String)) {
                errors.add("title deve ser string");
            } else if (((String) title).length() > 200) {
                errors.add("title não pode ter mais de 200 caracteres");
            }
        }

        if (category != null && !contentService.isValidCategory(category.toString())) {
            errors.add("category deve ser uma das opções válidas");
        }

        if (tags != null && !(tags instanceof List)) {
            errors.add("tags deve ser um array");
        } else if (tags instanceof List && ((List<?>) tags).size() > 20) {
            errors.add("tags não pode ter mais de 20 itens");
        }

        if (conteudo != null) {
            if (!(conteudo instanceof List)) {
                errors.add("conteudo deve ser um array");
            } else {
                List<?> list = (List<?>) conteudo;
                if (list.isEmpty()) {
                    errors.add("conteudo deve ter pelo menos um bloco");
                } else {
                    List<Map<String, Object>> blocks = list.stream()
                            .filter(m -> m instanceof Map)
                            .map(m -> (Map<String, Object>) m)
                            .collect(Collectors.toList());
                    // Validação de blocos de conteúdo desligada – aceita qualquer estrutura
                    // if (blocks.size() != list.size() || !contentService.validateContentBlocks(blocks)) {
                    //     errors.add("alguns blocos de conteudo são inválidos");
                    // }
                }
            }
        }

        return new ValidationResult(errors.isEmpty(), errors);
    }

    public CreatePostRequest sanitizeCreatePostData(String title, String category, List<String> tags,
                                                    String image, String excerpt, List<Map<String, Object>> conteudo,
                                                    String readingTime) {
        CreatePostRequest r = new CreatePostRequest();
        r.setTitle(title != null ? title.trim().substring(0, Math.min(200, title.trim().length())) : "");
        r.setCategory(category != null ? category : "");
        r.setTags(tags != null ? tags.stream().map(t -> t != null ? t.trim() : "").limit(20).collect(Collectors.toList()) : List.of());
        r.setImage(image != null ? image.trim().substring(0, Math.min(500, image.trim().length())) : "");
        r.setExcerpt(excerpt != null ? excerpt.trim().substring(0, Math.min(500, excerpt.trim().length())) : "");
        r.setConteudo(conteudo != null ? conteudo : List.of());
        r.setReadingTime(readingTime != null ? readingTime.trim() : null);
        return r;
    }

    public UpdatePostRequest sanitizeUpdatePostData(String title, String category, List<String> tags,
                                                    String image, String excerpt, List<Map<String, Object>> conteudo,
                                                    String readingTime) {
        UpdatePostRequest r = new UpdatePostRequest();
        if (title != null) r.setTitle(title.trim().substring(0, Math.min(200, title.trim().length())));
        if (category != null) r.setCategory(category);
        if (tags != null) r.setTags(tags.stream().map(t -> t != null ? t.trim() : "").limit(20).collect(Collectors.toList()));
        if (image != null) r.setImage(image.trim().substring(0, Math.min(500, image.trim().length())));
        if (excerpt != null) r.setExcerpt(excerpt.trim().substring(0, Math.min(500, excerpt.trim().length())));
        if (conteudo != null) r.setConteudo(conteudo);
        if (readingTime != null) r.setReadingTime(readingTime.trim());
        return r;
    }

    public record ValidationResult(boolean valid, List<String> errors) {}
}
