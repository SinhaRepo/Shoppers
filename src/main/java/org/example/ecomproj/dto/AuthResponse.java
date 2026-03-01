package org.example.ecomproj.dto;

public record AuthResponse(
        String token,
        String name,
        String email,
        String role
) {}
