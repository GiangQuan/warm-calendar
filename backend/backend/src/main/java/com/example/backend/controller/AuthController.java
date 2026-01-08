package com.example.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import com.example.backend.dto.AuthResponse;
import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.net.URI;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/success")
    public ResponseEntity<Void> loginSuccess(@AuthenticationPrincipal OAuth2User principal) {
        if (principal != null) {
            String email = principal.getAttribute("email");
            String googleId = principal.getAttribute("sub");
            String name = principal.getAttribute("name");
            String picture = principal.getAttribute("picture");

            // Tìm hoặc tạo user mới
            userRepository.findByGoogleId(googleId)
                .orElseGet(() -> {
                    User newUser = User.builder()
                        .email(email)
                        .googleId(googleId)
                        .displayName(name)
                        .avatarUrl(picture)
                        .authProvider("google")
                        .build();
                    return userRepository.save(newUser);
                });

            // Chuyển hướng người dùng về lại Frontend trang callback
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create("http://localhost:5173/auth/callback"))
                    .build();
        }
        
        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create("http://localhost:5173/auth?error=google_failed"))
                .build();
    }

    @GetMapping("/me")
    public AuthResponse getCurrentUser(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) return AuthResponse.builder().message("Not logged in").build();
        
        String googleId = principal.getAttribute("sub");
        User user = userRepository.findByGoogleId(googleId).orElse(null);
        
        if (user == null) {
            // Trường hợp user login local (nếu dùng session) hoặc không tìm thấy
            return AuthResponse.builder().message("User details not found").build();
        }
        
        return AuthResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .avatarUrl(user.getAvatarUrl())
                .message("Success")
                .build();
    }

    @GetMapping("/test")
    public Map<String, String> test() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "Backend is running!");
        response.put("message", "OAuth2 is configured. Visit http://localhost:8080/oauth2/authorization/google to test login.");
        return response;
    }

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

}
