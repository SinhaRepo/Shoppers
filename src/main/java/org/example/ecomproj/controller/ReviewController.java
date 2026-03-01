package org.example.ecomproj.controller;

import jakarta.validation.Valid;
import org.example.ecomproj.dto.ReviewRequest;
import org.example.ecomproj.dto.ReviewResponse;
import org.example.ecomproj.service.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/products/{productId}/reviews")
    public ResponseEntity<List<ReviewResponse>> getProductReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getProductReviews(productId));
    }

    @PostMapping("/products/{productId}/reviews")
    public ResponseEntity<ReviewResponse> addReview(
            @PathVariable Long productId,
            @Valid @RequestBody ReviewRequest request,
            Authentication authentication) {
        Long userId = (Long) authentication.getCredentials();
        ReviewResponse response = reviewService.addReview(productId, userId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/reviews/{reviewId}/helpful")
    public ResponseEntity<ReviewResponse> markHelpful(@PathVariable Long reviewId) {
        return ResponseEntity.ok(reviewService.markHelpful(reviewId));
    }
}
