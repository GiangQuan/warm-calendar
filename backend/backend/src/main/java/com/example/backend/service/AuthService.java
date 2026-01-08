package com.example.backend.service;

import com.example.backend.dto.AuthResponse;
import com.example.backend.dto.LoginRequest;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.backend.dto.RegisterRequest;

@Service
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
                    .message("Sai email hoặc mật khẩu!")
                    .build();
        }

        // 3. Đăng nhập thành công, trả về thông tin user
        return mapToResponse(user, "Đăng nhập thành công!");
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
    // 1. Kiểm tra email đã tồn tại chưa
    if (userRepository.existsByEmail(request.getEmail())) {
        return AuthResponse.builder()
                .message("Email đã được sử dụng!")
                .build();
    }

    // 2. Hash password trước khi lưu
    String hashedPassword = passwordEncoder.encode(request.getPassword());  // 👈 QUAN TRỌNG

    // 3. Tạo user mới
    User newUser = User.builder()
            .email(request.getEmail())
            .password(hashedPassword)  // Lưu password đã hash
            .displayName(request.getDisplayName())
            .authProvider("local")
            .build();

    // 4. Lưu vào DB
    userRepository.save(newUser);

    return mapToResponse(newUser, "Đăng ký thành công!");
}
}