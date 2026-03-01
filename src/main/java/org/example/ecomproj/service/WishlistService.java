package org.example.ecomproj.service;

import org.example.ecomproj.model.Product;
import org.example.ecomproj.model.User;
import org.example.ecomproj.model.Wishlist;
import org.example.ecomproj.repository.ProductRepo;
import org.example.ecomproj.repository.UserRepo;
import org.example.ecomproj.repository.WishlistRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WishlistService {

    private final WishlistRepo wishlistRepo;
    private final UserRepo userRepo;
    private final ProductRepo productRepo;

    public WishlistService(WishlistRepo wishlistRepo, UserRepo userRepo, ProductRepo productRepo) {
        this.wishlistRepo = wishlistRepo;
        this.userRepo = userRepo;
        this.productRepo = productRepo;
    }

    @Transactional
    public void addToWishlist(Long userId, Long productId) {
        if (wishlistRepo.existsByUserIdAndProductId(userId, productId)) {
            return; // Already wishlisted — idempotent
        }

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setProduct(product);
        wishlistRepo.save(wishlist);
    }

    @Transactional
    public void removeFromWishlist(Long userId, Long productId) {
        wishlistRepo.deleteByUserIdAndProductId(userId, productId);
    }

    @Transactional(readOnly = true)
    public List<Product> getUserWishlist(Long userId) {
        return wishlistRepo.findByUserIdWithProduct(userId)
                .stream()
                .map(Wishlist::getProduct)
                .toList();
    }

    public boolean isWishlisted(Long userId, Long productId) {
        return wishlistRepo.existsByUserIdAndProductId(userId, productId);
    }

    @Transactional
    public void clearWishlist(Long userId) {
        wishlistRepo.deleteByUserId(userId);
    }
}
