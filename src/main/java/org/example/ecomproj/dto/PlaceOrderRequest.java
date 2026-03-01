package org.example.ecomproj.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record PlaceOrderRequest(
        @NotEmpty(message = "Order must have at least one item") List<OrderItemRequest> items,
        @NotBlank(message = "Payment method is required") String paymentMethod,
        @NotBlank(message = "Delivery name is required") String deliveryName,
        @NotBlank(message = "Delivery email is required") String deliveryEmail,
        @NotBlank(message = "Delivery phone is required") String deliveryPhone,
        @NotBlank(message = "Delivery address is required") String deliveryAddress,
        @NotBlank(message = "Delivery city is required") String deliveryCity,
        @NotBlank(message = "Delivery state is required") String deliveryState,
        @NotBlank(message = "Delivery PIN is required") String deliveryPin
) {}
