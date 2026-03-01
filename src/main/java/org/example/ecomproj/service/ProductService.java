package org.example.ecomproj.service;

import org.example.ecomproj.dto.ProductResponse;
import org.example.ecomproj.model.Product;
import org.example.ecomproj.repository.ProductRepo;
import org.example.ecomproj.repository.ReviewRepo;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProductService {

    private final ProductRepo repo;
    private final CloudinaryService cloudinaryService;
    private final ReviewRepo reviewRepo;

    public ProductService(ProductRepo repo, CloudinaryService cloudinaryService, ReviewRepo reviewRepo) {
        this.repo = repo;
        this.cloudinaryService = cloudinaryService;
        this.reviewRepo = reviewRepo;
    }

    // ----------- Rating stats cache (per-request) -----------

    /** Batch-load all product rating stats in one query. */
    private Map<Long, double[]> loadAllRatingStats() {
        Map<Long, double[]> map = new HashMap<>();
        for (Object[] row : reviewRepo.findAllProductRatingStats()) {
            Long productId = (Long) row[0];
            Double avg = (Double) row[1];
            Long count = (Long) row[2];
            map.put(productId, new double[]{avg != null ? avg : 0, count != null ? count : 0});
        }
        return map;
    }

    // ----------- DTO mapping -----------

    public ProductResponse toDTO(Product p, Map<Long, double[]> statsMap) {
        double[] stats = statsMap.getOrDefault(p.getId(), new double[]{0, 0});
        return new ProductResponse(
                p.getId(), p.getName(), p.getDescription(), p.getBrand(),
                p.getPrice(), p.getMrp(), p.getCategory(), p.getReleaseDate(),
                p.isProductAvailable(), p.getStockQuantity(),
                p.getImageUrl1(), p.getImageUrl2(), p.getImageUrl3(),
                p.getImageUrl4(), p.getImageUrl5(), p.getAttributes(),
                stats[0] > 0 ? Math.round(stats[0] * 10.0) / 10.0 : null,
                (int) stats[1]
        );
    }

    public ProductResponse toDTO(Product p) {
        Double avg = reviewRepo.findAvgRatingByProductId(p.getId());
        Integer count = reviewRepo.countByProductId(p.getId());
        return new ProductResponse(
                p.getId(), p.getName(), p.getDescription(), p.getBrand(),
                p.getPrice(), p.getMrp(), p.getCategory(), p.getReleaseDate(),
                p.isProductAvailable(), p.getStockQuantity(),
                p.getImageUrl1(), p.getImageUrl2(), p.getImageUrl3(),
                p.getImageUrl4(), p.getImageUrl5(), p.getAttributes(),
                avg != null && avg > 0 ? Math.round(avg * 10.0) / 10.0 : null,
                count != null ? count : 0
        );
    }

    // ----------- Public API -----------

    public List<ProductResponse> getAllProducts() {
        List<Product> products = repo.findAll();
        Map<Long, double[]> stats = loadAllRatingStats();
        return products.stream().map(p -> toDTO(p, stats)).toList();
    }

    public ProductResponse getProductDTOById(Long id) {
        Product p = repo.findById(id).orElse(null);
        return p != null ? toDTO(p) : null;
    }

    public Product getProductById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public List<ProductResponse> getRelatedProducts(Long productId, int limit) {
        Product product = repo.findById(productId).orElse(null);
        if (product == null) return List.of();
        List<Product> related = repo.findByCategoryAndIdNot(product.getCategory(), productId);
        Map<Long, double[]> stats = loadAllRatingStats();
        return related.stream().limit(limit).map(p -> toDTO(p, stats)).toList();
    }

    public Product addProduct(Product product, MultipartFile imageFile) throws IOException {
        if (imageFile != null && !imageFile.isEmpty()) {
            String url = cloudinaryService.upload(imageFile);
            product.setImageUrl1(url);
            product.setImageName(imageFile.getOriginalFilename());
            product.setImageType(imageFile.getContentType());
        }
        return repo.save(product);
    }

    public Product updateProduct(Long id, Product product, MultipartFile imageFile) throws IOException {
        Product existing = repo.findById(id).orElse(null);
        if (existing == null) return null;

        if (imageFile != null && !imageFile.isEmpty()) {
            // Upload new image to Cloudinary
            String url = cloudinaryService.upload(imageFile);
            product.setImageUrl1(url);
            product.setImageName(imageFile.getOriginalFilename());
            product.setImageType(imageFile.getContentType());
            // Delete old Cloudinary image if it existed
            if (existing.getImageUrl1() != null
                    && existing.getImageUrl1().contains("cloudinary")) {
                cloudinaryService.delete(existing.getImageUrl1());
            }
        } else {
            // Preserve existing primary image data
            product.setImageUrl1(existing.getImageUrl1());
            product.setImageName(existing.getImageName());
            product.setImageType(existing.getImageType());
        }

        // Preserve imageUrl2-5 if incoming values are null (§3.5)
        if (product.getImageUrl2() == null) product.setImageUrl2(existing.getImageUrl2());
        if (product.getImageUrl3() == null) product.setImageUrl3(existing.getImageUrl3());
        if (product.getImageUrl4() == null) product.setImageUrl4(existing.getImageUrl4());
        if (product.getImageUrl5() == null) product.setImageUrl5(existing.getImageUrl5());

        // Preserve version for optimistic locking
        product.setVersion(existing.getVersion());

        return repo.save(product);
    }

    public void deleteProduct(Long id) {
        Product product = repo.findById(id).orElse(null);
        if (product != null) {
            // Delete Cloudinary image if present
            if (product.getImageUrl1() != null && product.getImageUrl1().contains("cloudinary")) {
                cloudinaryService.delete(product.getImageUrl1());
            }
            repo.deleteById(id);
        }
    }

    public List<ProductResponse> searchProducts(String keyword) {
        List<Product> products = repo.searchProducts(keyword);
        Map<Long, double[]> stats = loadAllRatingStats();
        return products.stream().map(p -> toDTO(p, stats)).toList();
    }
}
