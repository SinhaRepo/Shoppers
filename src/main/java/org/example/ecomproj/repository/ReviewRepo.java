package org.example.ecomproj.repository;

import org.example.ecomproj.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepo extends JpaRepository<Review, Long> {
    @Query("SELECT r FROM Review r JOIN FETCH r.user JOIN FETCH r.product WHERE r.product.id = :productId ORDER BY r.createdAt DESC")
    List<Review> findByProductIdWithUser(Long productId);

    @Query("SELECT r FROM Review r JOIN FETCH r.user JOIN FETCH r.product WHERE r.id = :reviewId")
    Optional<Review> findByIdWithRelations(Long reviewId);

    Optional<Review> findByProductIdAndUserId(Long productId, Long userId);
    boolean existsByProductIdAndUserId(Long productId, Long userId);

    @Query("SELECT COALESCE(AVG(r.rating), 0) FROM Review r WHERE r.product.id = :productId")
    Double findAvgRatingByProductId(Long productId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.product.id = :productId")
    Integer countByProductId(Long productId);

    @Query("SELECT r.product.id, AVG(r.rating), COUNT(r) FROM Review r GROUP BY r.product.id")
    List<Object[]> findAllProductRatingStats();
}
