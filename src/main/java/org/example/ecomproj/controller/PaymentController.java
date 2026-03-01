package org.example.ecomproj.controller;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import jakarta.validation.Valid;
import org.example.ecomproj.dto.CreatePaymentRequest;
import org.example.ecomproj.dto.VerifyPaymentRequest;
import org.example.ecomproj.service.OrderService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Value("${razorpay.key-id}")
    private String razorpayKeyId;

    @Value("${razorpay.key-secret}")
    private String razorpayKeySecret;

    private final OrderService orderService;

    public PaymentController(OrderService orderService) {
        this.orderService = orderService;
    }

    /**
     * Creates a Razorpay order for a given app order.
     */
    @PostMapping("/create-order")
    public ResponseEntity<Map<String, Object>> createRazorpayOrder(
            @Valid @RequestBody CreatePaymentRequest request,
            Authentication authentication) {
        try {
            int amountInPaise = (int) (request.amount() * 100);

            RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "order_" + request.orderId());

            Order razorpayOrder = client.orders.create(orderRequest);
            String razorpayOrderId = razorpayOrder.get("id");

            // Store razorpay order ID on our Order
            orderService.setRazorpayOrderId(request.orderId(), razorpayOrderId);

            return ResponseEntity.ok(Map.of(
                    "razorpayOrderId", razorpayOrderId,
                    "razorpayKeyId", razorpayKeyId,
                    "amount", amountInPaise,
                    "currency", "INR"
            ));
        } catch (RazorpayException e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to create Razorpay order: " + e.getMessage()));
        }
    }

    /**
     * Verifies Razorpay payment signature and marks the order as PAID.
     */
    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyPayment(
            @Valid @RequestBody VerifyPaymentRequest request,
            Authentication authentication) {
        try {
            Long userId = (Long) authentication.getCredentials();

            // Verify signature
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", request.razorpay_order_id());
            options.put("razorpay_payment_id", request.razorpay_payment_id());
            options.put("razorpay_signature", request.razorpay_signature());

            boolean isValid = Utils.verifyPaymentSignature(options, razorpayKeySecret);

            if (isValid) {
                orderService.confirmPayment(request.order_id(), userId, request.razorpay_payment_id());
                return ResponseEntity.ok(Map.of("status", "success", "message", "Payment verified"));
            } else {
                return ResponseEntity.badRequest()
                        .body(Map.of("status", "failed", "message", "Invalid payment signature"));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("status", "error", "message", e.getMessage()));
        }
    }
}
