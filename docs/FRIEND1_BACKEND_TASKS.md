# Người 1: Backend Developer (Auth Focus)

## Nhiệm vụ
Xây dựng **Authentication API** - quản lý đăng ký, đăng nhập, và Google Login.

---

## Checklist

### Setup
- [ ] Clone repo từ Leader
- [ ] Mở folder `backend/` trong IntelliJ
- [ ] Chạy app để test database connection
- [ ] Tạo branch: `git checkout -b backend-auth`

---

### Task 1: Tạo/Cập nhật User Entity
File: `src/main/java/com/calendar/model/User.java`

```java
package com.calendar.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    @Column(name = "display_name")
    private String displayName;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "google_id", unique = true)
    private String googleId;

    @Column(name = "auth_provider")
    private String authProvider = "local";

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

---

### Task 2: Tạo UserRepository
File: `src/main/java/com/calendar/repository/UserRepository.java`

```java
package com.calendar.repository;

import com.calendar.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByGoogleId(String googleId);
    boolean existsByEmail(String email);
}
```

---

### Task 3: Tạo DTOs
Location: `src/main/java/com/calendar/dto/`

**RegisterRequest.java**
```java
@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String displayName;
}
```

**LoginRequest.java**
```java
@Data
public class LoginRequest {
    private String email;
    private String password;
}
```

**GoogleLoginRequest.java**
```java
@Data
public class GoogleLoginRequest {
    private String credential;
}
```

**AuthResponse.java**
```java
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AuthResponse {
    private Long id;
    private String email;
    private String displayName;
    private String avatarUrl;
    private String message;
}
```

---

### Task 4: Tạo AuthService
File: `src/main/java/com/calendar/service/AuthService.java`

| Method | Mô tả |
|--------|-------|
| `register(RegisterRequest)` | Tạo user mới, hash password |
| `login(LoginRequest)` | Verify password, return user |
| `googleLogin(String credential)` | Verify Google token, create/find user |

Thêm vào `pom.xml`:
```xml
<dependency>
    <groupId>com.google.api-client</groupId>
    <artifactId>google-api-client</artifactId>
    <version>2.2.0</version>
</dependency>
```

---

### Task 5: Tạo AuthController
File: `src/main/java/com/calendar/controller/AuthController.java`

| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/api/auth/register` | POST | Đăng ký user mới |
| `/api/auth/login` | POST | Đăng nhập |
| `/api/auth/google` | POST | Đăng nhập bằng Google |

---

### Task 6: Tạo CORS Config
File: `src/main/java/com/calendar/config/CorsConfig.java`

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:5173")
            .allowedMethods("GET", "POST", "PUT", "DELETE")
            .allowedHeaders("*");
    }
}
```

---

## Khi hoàn thành
```bash
git add .
git commit -m "Add Auth API with Google Login"
git push origin backend-auth
```
Tạo **Pull Request** → Báo Leader review
