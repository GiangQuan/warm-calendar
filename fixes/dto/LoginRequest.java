package com.example.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * FIXED VERSION of LoginRequest DTO
 * 
 * Changes made:
 * 1. Added @Data annotation to automatically generate getters/setters
 * 2. Added @NoArgsConstructor and @AllArgsConstructor for flexibility
 * 3. Added validation annotations (@NotBlank, @Email, @Size)
 * 4. Removed broken manual getter methods that returned empty values
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
}
