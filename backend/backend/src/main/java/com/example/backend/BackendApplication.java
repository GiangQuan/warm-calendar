package com.example.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import javax.sql.DataSource;
import java.sql.Connection;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner testConnection(DataSource dataSource) {
        return args -> {
            try {
                // Thử lấy một kết nối đến database
                Connection connection = dataSource.getConnection();

                if (connection != null) {
                    System.out.println("-------------------------------------------");
                    System.out.println("✅ KẾT NỐI THÀNH CÔNG ĐẾN MYSQL!");
                    System.out.println("DATABASE NAME: " + connection.getCatalog());
                    System.out.println("-------------------------------------------");
                } else {
                    System.out.println("❌ KẾT NỐI THẤT BẠI (Connection is null)");
                }
            } catch (Exception e) {
                System.out.println("-------------------------------------------");
                System.out.println("❌ CÓ LỖI XẢY RA KHI KẾT NỐI:");
                System.out.println(e.getMessage()); // In ra lỗi cụ thể
                System.out.println("-------------------------------------------");
            }
        };
}}
