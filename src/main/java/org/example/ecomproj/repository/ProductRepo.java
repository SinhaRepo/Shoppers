package org.example.ecomproj.repository;

import org.example.ecomproj.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepo extends JpaRepository<Product, Long> {
    @Query("SELECT p from Product p WHERE "+
            "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword,'%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword,'%')) OR " +
            "LOWER(p.brand) LIKE LOWER(CONCAT('%', :keyword,'%')) OR " +
            "LOWER(p.category) LIKE LOWER(CONCAT('%', :keyword,'%'))")
    List<Product> searchProducts(String keyword);

    List<Product> findByCategoryAndIdNot(String category, Long id);
}
