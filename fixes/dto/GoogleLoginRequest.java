package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * FIXED VERSION of GoogleLoginRequest DTO
 * 
 * Changes made:
 * 1. Added @Data annotation to automatically generate getters/setters
 * 2. Added @NoArgsConstructor and @AllArgsConstructor for flexibility
 * 3. Added validation annotation (@NotBlank)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoogleLoginRequest {
    
    @NotBlank(message = "Google credential token is required")
    private String credential;
}
