# 🔐 Hướng dẫn sử dụng PasswordEncoder (BCrypt)

Trang ơi, bạn đã tạo `PasswordEncoder` Bean rồi nhưng chưa dùng nó trong `AuthService`. Làm theo hướng dẫn này để fix nhé!

---

## Bước 1: Inject PasswordEncoder vào AuthService

Mở file `AuthService.java`, thêm dòng này ở phần đầu class:

```java
@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;  // 👈 THÊM DÒNG NÀY

    // ... code còn lại
}
```

**Nhớ import:**

```java
import org.springframework.security.crypto.password.PasswordEncoder;
```

---

## Bước 2: Sửa method login()

**Hiện tại (SAI):**

```java
if (user == null || !user.getPassword().equals(request.getPassword())) {
```

**Sửa thành (ĐÚNG):**

```java
if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
```

> ⚠️ **Lưu ý thứ tự tham số:**
>
> - Tham số 1: `rawPassword` (password người dùng nhập)
> - Tham số 2: `encodedPassword` (password đã hash trong DB)

---

## Bước 3: Tạo method register() (nếu chưa có)

Thêm method này vào `AuthService.java`:

```java
public AuthResponse register(RegisterRequest request) {
    // 1. Kiểm tra email đã tồn tại chưa
    if (userRepository.existsByEmail(request.getEmail())) {
        return AuthResponse.builder()
                .message("Email đã được sử dụng!")
                .build();
    }

    // 2. Hash password trước khi lưu
    String hashedPassword = passwordEncoder.encode(request.getPassword());  // 👈 QUAN TRỌNG

    // 3. Tạo user mới
    User newUser = User.builder()
            .email(request.getEmail())
            .password(hashedPassword)  // Lưu password đã hash
            .displayName(request.getDisplayName())
            .authProvider("local")
            .build();

    // 4. Lưu vào DB
    userRepository.save(newUser);

    return mapToResponse(newUser, "Đăng ký thành công!");
}
```

---

## Bước 4: Thêm endpoint register vào AuthController

Mở file `AuthController.java`, thêm:

```java
@Autowired
private AuthService authService;

@PostMapping("/login")
public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
    return ResponseEntity.ok(authService.login(request));
}

@PostMapping("/register")
public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
    return ResponseEntity.ok(authService.register(request));
}
```

**Nhớ import:**

```java
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.example.backend.dto.*;
import com.example.backend.service.AuthService;
```

---

## Tóm tắt thay đổi

| File                  | Thay đổi                                                   |
| --------------------- | ---------------------------------------------------------- |
| `AuthService.java`    | Inject `PasswordEncoder`, sửa `login()`, thêm `register()` |
| `AuthController.java` | Thêm endpoint `/login` và `/register`                      |

---

## Test sau khi sửa

1. Chạy lại backend: `./mvnw spring-boot:run`
2. Test register:

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456","displayName":"Test User"}'
```

3. Test login:

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

Xong thì commit và push lên branch `backend-auth` nhé! 👍
