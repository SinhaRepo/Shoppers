package org.example.ecomproj.config;

import org.example.ecomproj.model.Role;
import org.example.ecomproj.model.User;
import org.example.ecomproj.repository.ProductRepo;
import org.example.ecomproj.repository.UserRepo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.nio.charset.StandardCharsets;

@Configuration
public class DataInitializer {

    @Value("classpath:data.sql")
    private Resource dataSqlResource;

    @Value("${ADMIN_PASSWORD}")
    private String adminPassword;

    @Value("${DEMO_PASSWORD}")
    private String demoPassword;

    @Bean
    CommandLineRunner seedData(UserRepo userRepo, ProductRepo productRepo,
                               PasswordEncoder passwordEncoder, JdbcTemplate jdbcTemplate) {
        return args -> {
            // Seed admin user
            if (!userRepo.existsByEmail("admin@shoppers.com")) {
                User admin = new User();
                admin.setName("Admin");
                admin.setEmail("admin@shoppers.com");
                admin.setPassword(passwordEncoder.encode(adminPassword));
                admin.setRole(Role.ADMIN);
                userRepo.save(admin);
            }

            // Seed demo customer user
            if (!userRepo.existsByEmail("demo@shoppers.com")) {
                User demo = new User();
                demo.setName("Demo User");
                demo.setEmail("demo@shoppers.com");
                demo.setPassword(passwordEncoder.encode(demoPassword));
                demo.setRole(Role.CUSTOMER);
                userRepo.save(demo);
            }

            // Seed products from data.sql (only if table is empty)
            if (productRepo.count() == 0) {
                String sql = new String(dataSqlResource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
                for (String stmt : sql.split(";")) {
                    String trimmed = stmt.trim();
                    if (!trimmed.isEmpty()) {
                        jdbcTemplate.execute(trimmed);
                    }
                }
            }
        };
    }
}
