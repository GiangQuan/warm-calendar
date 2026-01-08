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
    public Map<String, Object> loginSuccess(@AuthenticationPrincipal OAuth2User principal) {
        Map<String, Object> response = new HashMap<>();
        
        if (principal != null) {
            String email = principal.getAttribute("email");
            String googleId = principal.getAttribute("sub");
            String name = principal.getAttribute("name");
            String picture = principal.getAttribute("picture");

            // Tìm hoặc tạo user mới
            User user = userRepository.findByGoogleId(googleId)
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

            response.put("success", true);
            response.put("message", "Google OAuth Login Successful!");
            response.put("id", user.getId());
            response.put("email", user.getEmail());
            response.put("name", user.getDisplayName());
            response.put("picture", user.getAvatarUrl());
        } else {
            response.put("success", false);
            response.put("message", "Not authenticated");
        }
        
        return response;
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
