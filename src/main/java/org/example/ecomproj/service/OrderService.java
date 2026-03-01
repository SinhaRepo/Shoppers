package org.example.ecomproj.service;

import org.example.ecomproj.dto.*;
import org.example.ecomproj.model.*;
import org.example.ecomproj.repository.OrderRepo;
import org.example.ecomproj.repository.ProductRepo;
import org.example.ecomproj.repository.UserRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepo orderRepo;
    private final ProductRepo productRepo;
    private final UserRepo userRepo;

    public OrderService(OrderRepo orderRepo, ProductRepo productRepo, UserRepo userRepo) {
        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
        this.userRepo = userRepo;
    }

    @Transactional
    public OrderResponse placeOrder(PlaceOrderRequest request, Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setPaymentMethod(request.paymentMethod());
        order.setPaymentStatus("PENDING");
        order.setStatus(OrderStatus.PROCESSING);
        order.setDeliveryName(request.deliveryName());
        order.setDeliveryEmail(request.deliveryEmail());
        order.setDeliveryPhone(request.deliveryPhone());
        order.setDeliveryAddress(request.deliveryAddress());
        order.setDeliveryCity(request.deliveryCity());
        order.setDeliveryState(request.deliveryState());
        order.setDeliveryPin(request.deliveryPin());

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequest itemReq : request.items()) {
            Product product = productRepo.findById(itemReq.productId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemReq.productId()));

            if (product.getStockQuantity() == null || product.getStockQuantity() < itemReq.quantity()) {
                throw new RuntimeException("Insufficient stock for: " + product.getName());
            }

            // Deduct stock (optimistic locking via @Version handles concurrency)
            product.setStockQuantity(product.getStockQuantity() - itemReq.quantity());
            productRepo.save(product);

            // Snapshot product price at time of order
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemReq.quantity());
            orderItem.setPrice(product.getPrice());
            orderItem.setMrp(product.getMrp());

            order.getItems().add(orderItem);
            totalAmount = totalAmount.add(product.getPrice().multiply(BigDecimal.valueOf(itemReq.quantity())));
        }

        order.setTotalAmount(totalAmount);
        order = orderRepo.save(order);

        return toOrderResponse(order);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getUserOrders(Long userId) {
        return orderRepo.findByUserIdWithItems(userId)
                .stream()
                .map(this::toOrderResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long orderId, Long userId) {
        Order order = orderRepo.findByIdWithItems(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        return toOrderResponse(order);
    }

    @Transactional
    public OrderResponse cancelOrder(Long orderId, Long userId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        if (order.getStatus() != OrderStatus.PROCESSING) {
            throw new RuntimeException("Only PROCESSING orders can be cancelled");
        }

        // Restore stock
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
            productRepo.save(product);
        }

        order.setStatus(OrderStatus.CANCELLED);
        order = orderRepo.save(order);
        return toOrderResponse(order);
    }

    // ---- Admin methods ----

    @Transactional
    public OrderResponse confirmPayment(Long orderId, Long userId, String razorpayPaymentId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        order.setRazorpayPaymentId(razorpayPaymentId);
        order.setPaymentStatus("PAID");
        order = orderRepo.save(order);
        return toOrderResponse(order);
    }

    @Transactional
    public void setRazorpayOrderId(Long orderId, String razorpayOrderId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setRazorpayOrderId(razorpayOrderId);
        orderRepo.save(order);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return orderRepo.findAllWithItems()
                .stream()
                .map(this::toOrderResponse)
                .toList();
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, String status) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(OrderStatus.valueOf(status.toUpperCase()));

        if ("DELIVERED".equalsIgnoreCase(status)) {
            order.setPaymentStatus("PAID");
        }

        order = orderRepo.save(order);
        return toOrderResponse(order);
    }

    // ---- Mapping ----

    private OrderResponse toOrderResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .map(item -> new OrderItemResponse(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getProduct().getBrand(),
                        item.getProduct().getImageUrl1(),
                        item.getQuantity(),
                        item.getPrice(),
                        item.getMrp()
                ))
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getStatus().name(),
                order.getTotalAmount(),
                order.getPaymentMethod(),
                order.getPaymentStatus(),
                order.getRazorpayOrderId(),
                order.getDeliveryName(),
                order.getDeliveryEmail(),
                order.getDeliveryPhone(),
                order.getDeliveryAddress(),
                order.getDeliveryCity(),
                order.getDeliveryState(),
                order.getDeliveryPin(),
                order.getCreatedAt(),
                order.getUpdatedAt(),
                itemResponses
        );
    }
}
