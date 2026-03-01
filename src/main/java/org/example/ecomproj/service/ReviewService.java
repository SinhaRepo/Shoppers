package org.example.ecomproj.service;

import org.example.ecomproj.dto.ReviewRequest;
import org.example.ecomproj.dto.ReviewResponse;
import org.example.ecomproj.model.Product;
import org.example.ecomproj.model.Review;
import org.example.ecomproj.model.User;
import org.example.ecomproj.repository.ProductRepo;
import org.example.ecomproj.repository.ReviewRepo;
import org.example.ecomproj.repository.UserRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepo reviewRepo;
    private final ProductRepo productRepo;
    private final UserRepo userRepo;

    public ReviewService(ReviewRepo reviewRepo, ProductRepo productRepo, UserRepo userRepo) {
        this.reviewRepo = reviewRepo;
        this.productRepo = productRepo;
        this.userRepo = userRepo;
    }

    @Transactional
    public ReviewResponse addReview(Long productId, Long userId, ReviewRequest request) {
        if (reviewRepo.existsByProductIdAndUserId(productId, userId)) {
            throw new RuntimeException("You have already reviewed this product");
        }

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Review review = new Review();
        review.setProduct(product);
        review.setUser(user);
        review.setRating(request.rating());
        review.setTitle(request.title());
        review.setBody(request.body());

        review = reviewRepo.save(review);
        return toReviewResponse(review);
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getProductReviews(Long productId) {
        return reviewRepo.findByProductIdWithUser(productId)
                .stream()
                .map(this::toReviewResponse)
                .toList();
    }

    @Transactional
    public ReviewResponse markHelpful(Long reviewId) {
        Review review = reviewRepo.findByIdWithRelations(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        review.setHelpfulCount(review.getHelpfulCount() + 1);
        review = reviewRepo.save(review);
        return toReviewResponse(review);
    }

    private ReviewResponse toReviewResponse(Review review) {
        return new ReviewResponse(
                review.getId(),
                review.getProduct().getId(),
                review.getUser().getId(),
                review.getUser().getName(),
                review.getRating(),
                review.getTitle(),
                review.getBody(),
                review.getHelpfulCount(),
                review.getCreatedAt()
        );
    }
}
