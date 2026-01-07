package com.example.backend.model;

import jakarta.persistence.*;
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
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    private String password;

    @Column(name = "display_name")
    private String displayName;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "google_id", unique = true)
    private String googleId;

    @Column(name = "auth_provider")
    private String authProvider;

    // Thiết lập quan hệ ngược lại: 1 User có nhiều Events
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Event> events;
}
