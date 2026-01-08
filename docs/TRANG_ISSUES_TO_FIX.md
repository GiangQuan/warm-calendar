# 🔧 Danh sách vấn đề cần fix - Nhánh `backend-auth`

**Người thực hiện:** Thu Trang  
**Ngày review:** 2026-01-08  
**Reviewer:** GiangQuan

---

## 🚨 Vấn đề NGHIÊM TRỌNG (Blocking)

### 1. Package sai - Spring Boot không nhận diện code

**File ảnh hưởng:** Tất cả file trong `com.calendar.*`

**Vấn đề:** Code đang nằm ở `com.calendar.*` nhưng `@SpringBootApplication` nằm ở `com.example.backend`. Spring Boot chỉ quét package của nó và các sub-package, nên code của bạn sẽ **không được load**.

**Cách fix:** Di chuyển tất cả file từ:

```
src/main/java/com/calendar/...
```

Sang:

```
src/main/java/com/example/backend/...
```

Các file cần di chuyển:

- `com/calendar/model/User.java` → `com/example/backend/model/User.java`
- `com/calendar/repository/UserRepository.java` → `com/example/backend/repository/UserRepository.java`
- `com/calendar/dto/*.java` → `com/example/backend/dto/*.java`
- `com/calendar/service/AuthService.java` → `com/example/backend/service/AuthService.java`
- `com/calendar/controller/AuthController.java` → `com/example/backend/controller/AuthController.java`
- `com/calendar/config/CorsConfig.java` → `com/example/backend/config/CorsConfig.java`

**Nhớ update `package` declaration** trong mỗi file sau khi di chuyển!

---

### 2. Google Login không lưu user vào Database

**File:** `com/example/backend/controller/AuthController.java`

**Vấn đề:** Endpoint `/api/auth/success` chỉ trả về thông tin từ Google mà **không lưu** user vào database.

**Cách fix:** Thêm logic lưu user:

```java
@Autowired
private UserRepository userRepository;

@GetMapping("/success")
public Map<String, Object> loginSuccess(@AuthenticationPrincipal OAuth2User principal) {
    if (principal != null) {
        String email = principal.getAttribute("email");
        String googleId = principal.getAttribute("sub");
        String name = principal.getAttribute("name");
        String picture = principal.getAttribute("picture");

        // Tìm hoặc tạo user mới
        User user = userRepository.findByGoogleId(googleId)
            .orElseGet(() -> {
                User newUser = User.builder()
                    .email(email)
                    .googleId(googleId)
                    .displayName(name)
                    .avatarUrl(picture)
                    .authProvider("google")
                    .build();
                return userRepository.save(newUser);
            });

        // ... return response với user info
    }
}
```

---

### 3. Password không được hash (Bảo mật)

**File:** `com/calendar/service/AuthService.java` (dòng 22)

**Vấn đề:** Đang so sánh password trực tiếp bằng `.equals()`:

```java
if (!user.getPassword().equals(request.getPassword())) // ❌ SAI
```

**Cách fix:** Dùng `PasswordEncoder`:

```java
@Autowired
private PasswordEncoder passwordEncoder;

// Trong method login:
if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) // ✅ ĐÚNG
```

---

## ⚠️ Vấn đề CẦN BỔ SUNG

### 4. Thiếu Register endpoint

**File:** `AuthController.java`

**Cần thêm:**

```java
@PostMapping("/register")
public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
    AuthResponse response = authService.register(request);
    return ResponseEntity.ok(response);
}
```

### 5. Thiếu Register logic trong Service

**File:** `AuthService.java`

**Cần thêm method:**

```java
public AuthResponse register(RegisterRequest request) {
    if (userRepository.existsByEmail(request.getEmail())) {
        return AuthResponse.builder().message("Email đã tồn tại!").build();
    }

    User user = User.builder()
        .email(request.getEmail())
        .password(passwordEncoder.encode(request.getPassword()))  // Hash password!
        .displayName(request.getDisplayName())
        .authProvider("local")
        .build();

    userRepository.save(user);
    return mapToResponse(user, "Đăng ký thành công!");
}
```

---

## 🧹 Vấn đề DỌN DẸP

### 6. Thư mục thừa

**Thư mục:** `backend/demoGoogleOAuth`

**Vấn đề:** Đây là project test riêng, không nên có trong repo chính.

**Cách fix:** Xóa thư mục này:

```bash
rm -rf backend/demoGoogleOAuth
```

### 7. Dependency bị duplicate trong pom.xml

**File:** `backend/backend/pom.xml` (dòng 102-113)

**Vấn đề:** `google-api-client` được khai báo 2 lần.

**Cách fix:** Xóa 1 trong 2 block dependency trùng.

---

## ✅ Checklist trước khi commit

- [ ] Di chuyển tất cả file về package `com.example.backend`
- [ ] Update package declaration trong mỗi file
- [ ] Thêm logic lưu Google user vào DB
- [ ] Sử dụng PasswordEncoder cho password
- [ ] Thêm register endpoint và logic
- [ ] Xóa thư mục `demoGoogleOAuth`
- [ ] Xóa dependency trùng trong pom.xml
- [ ] Chạy `./mvnw compile` để kiểm tra
- [ ] Commit và push

---

**Sau khi fix xong, chạy lệnh:**

```bash
git add .
git commit -m "fix: Restructure packages, add proper auth logic, fix security issues"
git push origin backend-auth
```

Rồi báo Leader để review lại! 👍
