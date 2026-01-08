package com.example.backend.model;

import jakarta.persistence.*;
<<<<<<< HEAD
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name= "users")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class User {
=======
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User { // KHÔNG ĐƯỢC CÓ CHỮ 'FINAL' Ở ĐÂY

>>>>>>> backend-auth
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

<<<<<<< HEAD
    @Column(nullable = false, unique = true)
=======
    @Column(unique = true, nullable = false)
>>>>>>> backend-auth
    private String email;

    private String password;

    @Column(name = "display_name")
    private String displayName;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "google_id", unique = true)
    private String googleId;

<<<<<<< HEAD
    @Column(name = "auth_provider")
    private String authProvider;

    // Thiết lập quan hệ ngược lại: 1 User có nhiều Events
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Event> events;
}
=======
    @Builder.Default
    @Column(name = "auth_provider")
    private String authProvider = "local";

    @Column(name = "created_at", updatable = false)
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
}
>>>>>>> backend-auth
