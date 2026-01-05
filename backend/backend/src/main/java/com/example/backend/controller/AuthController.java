package com.example.backend.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @GetMapping("/success")
    public Map<String, Object> loginSuccess(@AuthenticationPrincipal OAuth2User principal) {
        Map<String, Object> response = new HashMap<>();
        
        if (principal != null) {
            response.put("success", true);
            response.put("message", "Google OAuth Login Successful!");
            response.put("email", principal.getAttribute("email"));
            response.put("name", principal.getAttribute("name"));
            response.put("picture", principal.getAttribute("picture"));
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
}
