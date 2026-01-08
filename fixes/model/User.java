package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * FIXED VERSION of User Entity
 * 
 * Changes made:
 * 1. Removed broken setFullName() and getFullName() methods
 * 2. Kept all existing functionality with Lombok annotations
 * 3. The displayName field already provides getters/setters via @Data
 */
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    @Column(name = "display_name")
    private String displayName;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "google_id", unique = true)
    private String googleId;

    @Column(name = "auth_provider")
    private String authProvider = "local";

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // ✅ REMOVED: Broken setFullName() and getFullName() methods
    // The displayName field already has proper getters/setters via @Data
}
