package com.example.demogoogleoauth;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // File: SecurityConfig.java

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/login", "/error").permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        .loginPage("/")
                        .defaultSuccessUrl("/user", true)
                )
                // --- THÊM ĐOẠN NÀY VÀO ---
                .logout(logout -> logout
                        .logoutUrl("/logout") // Lắng nghe đường dẫn /logout
                        .logoutSuccessUrl("/") // Logout xong thì quay về trang chủ (để login lại)
                        .permitAll() // Ai cũng được phép logout
                );
        // --------------------------

        return http.build();
    }
}