package com.blog.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Post {
    private String id;
    private String title;
    private String category;
    private List<String> tags;
    private String image;
    private Instant date;
    @JsonProperty("reading_time")
    private String readingTime;
    private String excerpt;
    private List<Map<String, Object>> conteudo;
    @JsonProperty("created_at")
    private Instant createdAt;
    @JsonProperty("updated_at")
    private Instant updatedAt;
}
