package com.blog.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ImageContent {
    private String src;
    private String alt;
    private Integer width;
    private Integer height;
    private String className;
}
