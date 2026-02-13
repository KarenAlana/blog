package com.blog.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.Map;

/**
 * Bloco de conteúdo do post. O campo "content" pode ser String (paragrafo, intro, conclusao)
 * ou objeto (ImageContent, TitleContent, CodeContent) conforme "tipo".
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ContentBlock {
    private String tipo;
    private Object content; // String ou Map/objeto (imagem, titulo, codigo)
}
