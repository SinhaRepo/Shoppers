package org.example.ecomproj.dto;

import java.time.LocalDateTime;

public record ReviewResponse(
        Long id,
        Long productId,
        Long userId,
        String userName,
        int rating,
        String title,
        String body,
        int helpfulCount,
        LocalDateTime createdAt
) {}
