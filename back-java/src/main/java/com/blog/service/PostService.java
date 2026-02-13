package com.blog.service;

import com.blog.model.CreatePostRequest;
import com.blog.model.Post;
import com.blog.model.UpdatePostRequest;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Service
public class PostService {

    private final WebClient supabaseWebClient;
    private final ContentService contentService;
    private final PostValidator postValidator;

    public PostService(@Qualifier("supabaseWebClient") WebClient supabaseWebClient, ContentService contentService, PostValidator postValidator) {
        this.supabaseWebClient = supabaseWebClient;
        this.contentService = contentService;
        this.postValidator = postValidator;
    }

    public List<Post> findAll() {
        List<Post> list = supabaseWebClient.get()
                .uri(uri -> uri.path("/posts").queryParam("order", "date.desc").build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Post>>() {})
                .block();
        return list != null ? list : List.of();
    }

    public Post findById(String id) {
        List<Post> list = supabaseWebClient.get()
                .uri(uri -> uri.path("/posts").queryParam("id", "eq." + id).build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Post>>() {})
                .block();
        if (list == null || list.isEmpty()) return null;
        return list.get(0);
    }

    public List<Post> findByCategory(String category) {
        List<Post> list = supabaseWebClient.get()
                .uri(uri -> uri.path("/posts")
                        .queryParam("category", "eq." + category)
                        .queryParam("order", "date.desc")
                        .build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Post>>() {})
                .block();
        return list != null ? list : List.of();
    }

    public Post create(CreatePostRequest request, String imagePath) {
        String readingTime = request.getReadingTime() != null
                ? request.getReadingTime()
                : contentService.calculateReadingTime(request.getConteudo());

        Map<String, Object> row = Map.of(
                "title", request.getTitle(),
                "category", request.getCategory(),
                "tags", request.getTags() != null ? request.getTags() : List.of(),
                "image", imagePath != null ? imagePath : request.getImage(),
                "excerpt", request.getExcerpt(),
                "conteudo", request.getConteudo() != null ? request.getConteudo() : List.of(),
                "reading_time", readingTime,
                "date", Instant.now().toString()
        );

        List<Post> inserted = supabaseWebClient.post()
                .uri("/posts")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(row)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Post>>() {})
                .block();

        if (inserted == null || inserted.isEmpty()) {
            throw new RuntimeException("Supabase não retornou o post criado");
        }
        return inserted.get(0);
    }

    public Post update(String id, UpdatePostRequest request, String imagePath) {
        Map<String, Object> updates = new java.util.HashMap<>();
        if (request.getTitle() != null) updates.put("title", request.getTitle());
        if (request.getCategory() != null) updates.put("category", request.getCategory());
        if (request.getTags() != null) updates.put("tags", request.getTags());
        if (request.getImage() != null || imagePath != null) updates.put("image", imagePath != null ? imagePath : request.getImage());
        if (request.getExcerpt() != null) updates.put("excerpt", request.getExcerpt());
        if (request.getConteudo() != null) updates.put("conteudo", request.getConteudo());
        if (request.getReadingTime() != null) {
            updates.put("reading_time", request.getReadingTime());
        } else if (request.getConteudo() != null) {
            updates.put("reading_time", contentService.calculateReadingTime(request.getConteudo()));
        }

        if (updates.isEmpty()) {
            return findById(id);
        }

        List<Post> updated = supabaseWebClient.patch()
                .uri(uri -> uri.path("/posts").queryParam("id", "eq." + id).build())
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(updates)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Post>>() {})
                .block();

        if (updated == null || updated.isEmpty()) return null;
        return updated.get(0);
    }

    public void delete(String id) {
        supabaseWebClient.delete()
                .uri(uri -> uri.path("/posts").queryParam("id", "eq." + id).build())
                .retrieve()
                .toBodilessEntity()
                .block();
    }

    public boolean exists(String id) {
        return findById(id) != null;
    }
}
