package org.example.ecomproj.controller;

import org.example.ecomproj.model.Product;
import org.example.ecomproj.service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping
    public ResponseEntity<List<Product>> getWishlist(Authentication authentication) {
        Long userId = (Long) authentication.getCredentials();
        return ResponseEntity.ok(wishlistService.getUserWishlist(userId));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<Map<String, String>> addToWishlist(
            @PathVariable Long productId,
            Authentication authentication) {
        Long userId = (Long) authentication.getCredentials();
        wishlistService.addToWishlist(userId, productId);
        return ResponseEntity.ok(Map.of("message", "Added to wishlist"));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Map<String, String>> removeFromWishlist(
            @PathVariable Long productId,
            Authentication authentication) {
        Long userId = (Long) authentication.getCredentials();
        wishlistService.removeFromWishlist(userId, productId);
        return ResponseEntity.ok(Map.of("message", "Removed from wishlist"));
    }

    @DeleteMapping
    public ResponseEntity<Map<String, String>> clearWishlist(Authentication authentication) {
        Long userId = (Long) authentication.getCredentials();
        wishlistService.clearWishlist(userId);
        return ResponseEntity.ok(Map.of("message", "Wishlist cleared"));
    }
}
