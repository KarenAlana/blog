package com.blog.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.upload-dir:uploads}")
    private String uploadDir;

    @Bean
    @Primary
    public ObjectMapper objectMapper(Jackson2ObjectMapperBuilder builder) {
        ObjectMapper mapper = builder.build();
        
        // Criar um deserializador customizado para Instant que aceita formato sem timezone
        SimpleModule instantModule = new SimpleModule();
        instantModule.addDeserializer(Instant.class, new StdDeserializer<Instant>(Instant.class) {
            @Override
            public Instant deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
                String text = p.getText();
                try {
                    // Tentar parse direto primeiro (formato ISO com timezone)
                    return Instant.parse(text);
                } catch (DateTimeParseException e) {
                    // Se falhar, tentar adicionar 'Z' no final (assumir UTC)
                    if (!text.contains("Z") && !text.contains("+") && !text.matches(".*T\\d{2}:\\d{2}:\\d{2}.*[+-]\\d{2}:\\d{2}")) {
                        try {
                            return Instant.parse(text + "Z");
                        } catch (DateTimeParseException e2) {
                            // Se ainda falhar, tentar parse como LocalDateTime e converter para UTC
                            try {
                                LocalDateTime localDateTime = LocalDateTime.parse(text, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
                                return localDateTime.toInstant(ZoneOffset.UTC);
                            } catch (DateTimeParseException e3) {
                                throw new IOException("Não foi possível fazer parse da data: " + text, e3);
                            }
                        }
                    }
                    throw new IOException("Não foi possível fazer parse da data: " + text, e);
                }
            }
        });
        
        mapper.registerModule(new JavaTimeModule());
        mapper.registerModule(instantModule);
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        
        return mapper;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**").allowedOriginPatterns("*").allowedMethods("*");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadPath + "/");
    }
}
