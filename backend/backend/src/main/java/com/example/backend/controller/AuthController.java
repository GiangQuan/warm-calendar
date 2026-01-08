package com.example.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import com.example.backend.dto.AuthResponse;
import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.dto.UpdateProfileRequest;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import java.net.URI;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Slf4j
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @GetMapping("/success")
    public ResponseEntity<Void> loginSuccess(@AuthenticationPrincipal OAuth2User principal) {
        log.info("Google login success endpoint hit");
        if (principal != null) {
            String email = principal.getAttribute("email");
            log.info("Google user email: {}", email);
            String googleId = principal.getAttribute("sub");
            String name = principal.getAttribute("name");
            String picture = principal.getAttribute("picture");

            // Tìm hoặc tạo user mới thông minh hơn
            User user = userRepository.findByGoogleId(googleId)
                .orElseGet(() -> userRepository.findByEmail(email).map(existingUser -> {
                    // Nếu đã có local account cùng email, gắn Google ID vào
                    existingUser.setGoogleId(googleId);
                    if (existingUser.getAvatarUrl() == null) existingUser.setAvatarUrl(picture);
                    return userRepository.save(existingUser);
                }).orElseGet(() -> {
                    // Nếu hoàn toàn mới, tạo mới
                    User newUser = User.builder()
                        .email(email)
                        .googleId(googleId)
                        .displayName(name)
                        .avatarUrl(picture)
                        .authProvider("google")
                        .build();
                    return userRepository.save(newUser);
                }));

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
    public AuthResponse getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            log.warn("/me endpoint hit but user is not authenticated");
            return AuthResponse.builder().message("Not logged in").build();
        }
        
        log.info("/me endpoint hit, authenticated user: {} (Class: {})", 
                authentication.getName(), authentication.getClass().getSimpleName());
        User user = null;
        if (authentication instanceof OAuth2AuthenticationToken token) {
            String googleId = token.getPrincipal().getAttribute("sub");
            user = userRepository.findByGoogleId(googleId).orElse(null);
        } else {
            String email = authentication.getName();
            user = userRepository.findByEmail(email).orElse(null);
        }
        
        if (user == null) {
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
    public AuthResponse register(@RequestBody RegisterRequest request, HttpServletRequest servletRequest) {
        AuthResponse response = authService.register(request);
        if (response.getId() != null) {
            // Tự động log in sau khi register
            authenticateUser(request.getEmail(), request.getPassword(), servletRequest);
        }
        return response;
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request, HttpServletRequest servletRequest) {
        AuthResponse response = authService.login(request);
        if (response.getId() != null) {
            // Thiết lập session cho local login
            authenticateUser(request.getEmail(), request.getPassword(), servletRequest);
        }
        return response;
    }

    private void authenticateUser(String email, String password, HttpServletRequest request) {
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(email, password);
        Authentication authentication = authenticationManager.authenticate(token);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        // Lưu SecurityContext vào Session
        HttpSession session = request.getSession(true);
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, SecurityContextHolder.getContext());
    }

    @PutMapping("/update")
    public AuthResponse updateProfile(@RequestBody UpdateProfileRequest request, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return AuthResponse.builder().message("Not logged in").build();
        }
        return authService.updateProfile(authentication.getName(), request);
    }

}
