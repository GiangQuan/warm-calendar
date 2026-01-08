package com.example.backend.service;

import com.example.backend.dto.AuthResponse;
import com.example.backend.dto.LoginRequest;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.dto.UpdateProfileRequest;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    
    
    // Phương thức Login
    public AuthResponse login(LoginRequest request) {
        // 1. Tìm user trong database theo email
        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        // 2. Kiểm tra nếu không thấy user hoặc sai mật khẩu
        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return AuthResponse.builder()
                    .message("Invalid email or password")
                    .build();
        }

        // 3. Đăng nhập thành công, trả về thông tin user
        return mapToResponse(user, "Login successful");
    }

    // Hàm phụ để đóng gói dữ liệu trả về (Bạn đã viết ở task trước)
    private AuthResponse mapToResponse(User user, String message) {
        return AuthResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .avatarUrl(user.getAvatarUrl())
                .message(message)
                .build();
    }

    public AuthResponse register(RegisterRequest request) {
        log.info("Attempting to register user with email: {}", request.getEmail());
        
        // 1. Kiểm tra email đã tồn tại chưa
        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Registration failed: Email {} already exists", request.getEmail());
            return AuthResponse.builder()
                    .message("Email already registered")
                    .build();
        }

        try {
            // 2. Hash password trước khi lưu
            String hashedPassword = passwordEncoder.encode(request.getPassword());

            // 3. Tạo user mới
            User newUser = User.builder()
                    .email(request.getEmail())
                    .password(hashedPassword)
                    .displayName(request.getDisplayName())
                    .authProvider("local")
                    .build();

            // 4. Lưu vào DB
            User savedUser = userRepository.save(newUser);
            log.info("User registered successfully with ID: {}", savedUser.getId());

            return mapToResponse(savedUser, "Signup successful");
        } catch (Exception e) {
            log.error("Error during registration for email {}: {}", request.getEmail(), e.getMessage());
            return AuthResponse.builder()
                    .message("Error during registration: " + e.getMessage())
                    .build();
        }
    }

    public AuthResponse updateProfile(String email, UpdateProfileRequest request) {
        log.info("Updating profile for user: {}", email);
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getDisplayName() != null) {
            user.setDisplayName(request.getDisplayName());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }

        User updatedUser = userRepository.save(user);
        log.info("Profile updated successfully for User ID: {}", updatedUser.getId());

        return mapToResponse(updatedUser, "Profile updated successfully");
    }
}