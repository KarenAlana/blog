package com.blog.service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Serviço para validar e manipular blocos de conteúdo (equivalente ao contentService.ts).
 */
@Service
public class ContentService {

    public static final List<String> AVAILABLE_CATEGORIES = List.of(
            "Programação", "Tecnologia", "Design", "Negócios"
    );

    public static final List<String> AVAILABLE_CONTENT_TYPES = List.of(
            "intro", "imagem", "titulo", "codigo", "conclusao", "paragrafo"
    );

    public boolean isValidCategory(String category) {
        return category != null && AVAILABLE_CATEGORIES.contains(category);
    }

    public boolean isValidContentType(String type) {
        return type != null && AVAILABLE_CONTENT_TYPES.contains(type);
    }

    @SuppressWarnings("unchecked")
    public boolean validateContentBlock(Map<String, Object> block) {
        if (block == null || block.get("tipo") == null || block.get("content") == null) {
            return false;
        }
        String tipo = block.get("tipo").toString();
        Object content = block.get("content");

        return switch (tipo) {
            case "imagem" -> validateImageBlock(content);
            case "titulo" -> validateTitleContent(content);
            case "codigo" -> validateCodeBlock(content);
            case "intro", "conclusao", "paragrafo" -> content instanceof String;
            default -> content instanceof String;
        };
    }

    private boolean validateImageBlock(Object content) {
        if (!(content instanceof Map<?, ?> m)) return false;
        return m.get("src") instanceof String && m.get("alt") instanceof String;
    }

    private boolean validateTitleContent(Object content) {
        if (!(content instanceof Map<?, ?> m)) return false;
        return m.get("text") instanceof String;
    }

    @SuppressWarnings("unchecked")
    private boolean validateCodeBlock(Object content) {
        if (!(content instanceof Map<?, ?> m)) return false;
        Object ex = m.get("examples");
        if (!(ex instanceof List<?> list)) return false;
        for (Object item : list) {
            if (!(item instanceof Map<?, ?> e)) return false;
            if (!(e.get("language") instanceof String) || !(e.get("code") instanceof String)) {
                return false;
            }
        }
        return true;
    }

    public boolean validateContentBlocks(List<Map<String, Object>> blocks) {
        if (blocks == null) return false;
        return blocks.stream().allMatch(this::validateContentBlock);
    }

    /**
     * Calcula tempo de leitura (≈200 palavras/min).
     */
    public String calculateReadingTime(List<Map<String, Object>> blocks) {
        if (blocks == null) return "5 min de leitura";
        double totalWords = 0;

        for (Map<String, Object> block : blocks) {
            String tipo = block.get("tipo") != null ? block.get("tipo").toString() : "";
            Object content = block.get("content");

            if ("titulo".equals(tipo) && content instanceof Map<?, ?> m) {
                Object text = m.get("text");
                if (text != null) totalWords += text.toString().split("\\s+").length;
            } else if ("codigo".equals(tipo) && content instanceof Map<?, ?> m) {
                Object examples = m.get("examples");
                if (examples instanceof List<?> list) {
                    for (Object ex : list) {
                        if (ex instanceof Map<?, ?> e && e.get("code") != null) {
                            totalWords += e.get("code").toString().split("\\s+").length * 0.5;
                        }
                    }
                }
            } else if (content instanceof String s) {
                totalWords += s.split("\\s+").length;
            }
        }

        int minutes = Math.max(1, (int) Math.ceil(totalWords / 200));
        return minutes + " min de leitura";
    }
}
