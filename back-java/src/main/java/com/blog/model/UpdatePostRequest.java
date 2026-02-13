package com.blog.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class UpdatePostRequest {
    private String title;
    private String category;
    private List<String> tags;
    private String image;
    private String excerpt;
    private List<Map<String, Object>> conteudo;
    private String readingTime;
}
