package org.example.ecomproj.dto;

import java.math.BigDecimal;

public record OrderItemResponse(
        Long productId,
        String productName,
        String productBrand,
        String productImage,
        int quantity,
        BigDecimal price,
        BigDecimal mrp
) {}
