package com.calendar.dto;

import lombok.*;

@Data
@Builder // Thêm cái này để hết lỗi đỏ ở .id(), .email()...
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private Long id;
    private String email;
    private String displayName;
    private String avatarUrl;
    private String message;
}