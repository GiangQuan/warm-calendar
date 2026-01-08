package com.example.backend.service;

import com.example.backend.dto.*;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * FIXED VERSION of AuthService
 * 
 * Changes made:
 * 1. Added PasswordEncoder dependency to hash/verify passwords
 * 2. Fixed login() to use BCrypt password verification instead of plain text
 * 3. Added complete register() implementation with password hashing
 * 4. Changed Vietnamese messages to English
 * 5. Added basic error handling
 * 6. Added googleLogin() method stub for future implementation
 */
@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;  // ✅ ADDED: Inject password encoder

    /**
     * FIXED: Login method now uses BCrypt password verification
     */
    public AuthResponse login(LoginRequest request) {
        try {
            // 1. Find user in database by email
            User user = userRepository.findByEmail(request.getEmail())
                    .orElse(null);

            // 2. Check if user exists and password is correct
            // ✅ FIXED: Use passwordEncoder.matches() instead of plain text comparison
            if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return AuthResponse.builder()
                        .message("Invalid email or password")  // ✅ FIXED: English message
                        .build();
            }

            // 3. Login successful, return user information
            return mapToResponse(user, "Login successful!");
        } catch (Exception e) {
            return AuthResponse.builder()
                    .message("An error occurred during login: " + e.getMessage())
                    .build();
        }
    }

    /**
     * NEW: Register method implementation
     */
    public AuthResponse register(RegisterRequest request) {
        try {
            // 1. Check if email already exists
            if (userRepository.existsByEmail(request.getEmail())) {
                return AuthResponse.builder()
                        .message("Email already exists")
                        .build();
            }

            // 2. Create new user with hashed password
            User user = User.builder()
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))  // ✅ Hash password with BCrypt
                    .displayName(request.getDisplayName())
                    .authProvider("local")
                    .build();

            // 3. Save user to database
            user = userRepository.save(user);

            // 4. Return success response
            return mapToResponse(user, "Registration successful!");
        } catch (Exception e) {
            return AuthResponse.builder()
                    .message("An error occurred during registration: " + e.getMessage())
                    .build();
        }
    }

    /**
     * TODO: Implement Google login with token verification
     * 
     * Steps needed:
     * 1. Verify Google credential token using Google API client
     * 2. Extract user information from verified token
     * 3. Find existing user by googleId or create new user
     * 4. Return user information
     */
    public AuthResponse googleLogin(GoogleLoginRequest request) {
        // Placeholder implementation
        return AuthResponse.builder()
                .message("Google login not yet fully implemented")
                .build();
        
        /* Full implementation would look like this:
        
        try {
            // Verify Google token
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(), 
                new GsonFactory()
            )
            .setAudience(Collections.singletonList(GOOGLE_CLIENT_ID))
            .build();
            
            GoogleIdToken idToken = verifier.verify(request.getCredential());
            
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String googleId = payload.getSubject();
                String email = payload.getEmail();
                String name = (String) payload.get("name");
                String pictureUrl = (String) payload.get("picture");
                
                // Find or create user
                User user = userRepository.findByGoogleId(googleId)
                    .orElseGet(() -> {
                        User newUser = User.builder()
                            .email(email)
                            .displayName(name)
                            .avatarUrl(pictureUrl)
                            .googleId(googleId)
                            .authProvider("google")
                            .build();
                        return userRepository.save(newUser);
                    });
                
                return mapToResponse(user, "Google login successful!");
            } else {
                return AuthResponse.builder()
                    .message("Invalid Google token")
                    .build();
            }
        } catch (Exception e) {
            return AuthResponse.builder()
                .message("Google login error: " + e.getMessage())
                .build();
        }
        */
    }

    /**
     * Helper method to map User entity to AuthResponse DTO
     */
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
