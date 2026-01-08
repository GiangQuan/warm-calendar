package com.example.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * FIXED VERSION of RegisterRequest DTO
 * 
 * Changes made:
 * 1. Added @Data annotation to automatically generate getters/setters
 * 2. Added @NoArgsConstructor and @AllArgsConstructor for flexibility
 * 3. Added validation annotations (@NotBlank, @Email, @Size)
 * 4. Removed broken manual getter methods that returned empty values
 * 5. Removed getFullName() method - field is called displayName, not fullName
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
    private String password;
    
    @NotBlank(message = "Display name is required")
    @Size(min = 2, max = 100, message = "Display name must be between 2 and 100 characters")
    private String displayName;
}
