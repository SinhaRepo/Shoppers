package org.example.ecomproj.dto;

import java.math.BigDecimal;
import java.util.Date;

/**
 * Lightweight product representation returned by the API.
 * Hides internal fields like imageData, version, and hibernate proxies.
 * Includes computed fields: avgRating, reviewCount.
 */
public record ProductResponse(
        Long id,
        String name,
        String description,
        String brand,
        BigDecimal price,
        BigDecimal mrp,
        String category,
        Date releaseDate,
        boolean productAvailable,
        Integer stockQuantity,
        String imageUrl1,
        String imageUrl2,
        String imageUrl3,
        String imageUrl4,
        String imageUrl5,
        String attributes,
        Double avgRating,
        Integer reviewCount
) {}
