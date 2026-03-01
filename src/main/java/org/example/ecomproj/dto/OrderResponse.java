package org.example.ecomproj.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Long id,
        String status,
        BigDecimal totalAmount,
        String paymentMethod,
        String paymentStatus,
        String razorpayOrderId,
        String deliveryName,
        String deliveryEmail,
        String deliveryPhone,
        String deliveryAddress,
        String deliveryCity,
        String deliveryState,
        String deliveryPin,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        List<OrderItemResponse> items
) {}
