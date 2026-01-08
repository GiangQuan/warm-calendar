package com.calendar.dto;

import org.jspecify.annotations.Nullable;

public class LoginRequest {
    private String email;
    private String password;

    public @Nullable CharSequence getPassword() {
        return null;
    }

    public String getEmail() {
        return "";
    }
}
