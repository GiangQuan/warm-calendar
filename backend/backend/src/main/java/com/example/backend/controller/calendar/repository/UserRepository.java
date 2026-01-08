package com.example.backend.controller.calendar.repository;

import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email); // Dùng cho hàm login
    boolean existsByEmail(String email);     // Dùng cho hàm register
}
