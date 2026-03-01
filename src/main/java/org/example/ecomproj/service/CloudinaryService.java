package org.example.ecomproj.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(
            @Value("${cloudinary.cloud-name}") String cloudName,
            @Value("${cloudinary.api-key}") String apiKey,
            @Value("${cloudinary.api-secret}") String apiSecret) {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true
        ));
    }

    /**
     * Upload an image to Cloudinary and return the secure URL.
     */
    public String upload(MultipartFile file) throws IOException {
        Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "folder", "shoppers/products",
                "resource_type", "image"
        ));
        return (String) result.get("secure_url");
    }

    /**
     * Extract public ID from a Cloudinary URL and delete the image.
     */
    public void delete(String cloudinaryUrl) {
        if (cloudinaryUrl == null || cloudinaryUrl.isBlank()) return;
        try {
            // URL format: https://res.cloudinary.com/{cloud}/image/upload/v{version}/{folder}/{publicId}.{ext}
            String publicId = extractPublicId(cloudinaryUrl);
            if (publicId != null) {
                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            }
        } catch (Exception e) {
            // Log but don't fail the operation if image deletion fails
            System.err.println("Failed to delete Cloudinary image: " + e.getMessage());
        }
    }

    private String extractPublicId(String url) {
        // Example: https://res.cloudinary.com/dpem2quip/image/upload/v1234/shoppers/products/abc123.jpg
        // Public ID: shoppers/products/abc123
        try {
            String afterUpload = url.substring(url.indexOf("/upload/") + 8);
            // Skip version number (v1234567890/)
            if (afterUpload.startsWith("v")) {
                afterUpload = afterUpload.substring(afterUpload.indexOf("/") + 1);
            }
            // Remove file extension
            return afterUpload.substring(0, afterUpload.lastIndexOf("."));
        } catch (Exception e) {
            return null;
        }
    }
}
