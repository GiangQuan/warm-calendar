package com.example.backend.service;

import com.example.backend.dto.AuthResponse;
import com.example.backend.dto.LoginRequest;
import com.example.backend.model.User;
import com.example.backend.controller.calendar.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    // Phương thức Login
    public AuthResponse login(LoginRequest request) {
        // 1. Tìm user trong database theo email
        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        // 2. Kiểm tra nếu không thấy user hoặc sai mật khẩu
        if (user == null || !user.getPassword().equals(request.getPassword())) {
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
}