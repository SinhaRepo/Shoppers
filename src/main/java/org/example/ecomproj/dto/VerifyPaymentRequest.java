package org.example.ecomproj.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record VerifyPaymentRequest(
        @NotBlank(message = "razorpay_order_id is required")
        String razorpay_order_id,

        @NotBlank(message = "razorpay_payment_id is required")
        String razorpay_payment_id,

        @NotBlank(message = "razorpay_signature is required")
        String razorpay_signature,

        @NotNull(message = "order_id is required")
        Long order_id
) {}
