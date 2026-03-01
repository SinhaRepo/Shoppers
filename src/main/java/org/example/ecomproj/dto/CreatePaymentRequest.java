package org.example.ecomproj.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreatePaymentRequest(
        @NotNull(message = "orderId is required")
        Long orderId,

        @NotNull(message = "amount is required")
        @Positive(message = "amount must be positive")
        Double amount
) {}
