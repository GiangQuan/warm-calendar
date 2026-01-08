package com.example.backend.controller.calendar.dto;

import org.jspecify.annotations.Nullable;

public class RegisterRequest {
    private String email;
    private String password;
    private String displayName;

    public String getEmail() {
        return "";
    }

    public @Nullable CharSequence getPassword() {
        return null;
    }

    public Object getFullName() {
        return null;
    }

    public String getDisplayName() {
        return "";
    }
}