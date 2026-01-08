package com.example.backend.controller.calendar.controller;

import com.calendar.dto.*;
import com.example.backend.controller.calendar.dto.AuthResponse;
import com.example.backend.controller.calendar.dto.LoginRequest;
import com.example.backend.controller.calendar.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") // Quan trọng: Để Frontend (Vite/React) gọi được API
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}