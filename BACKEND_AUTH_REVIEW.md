# Backend Auth Branch Code Review

**Reviewer:** Copilot AI  
**Branch:** `backend-auth` (Thu Trang)  
**Date:** 2026-01-08  
**Status:** ⚠️ Issues Found - Requires Fixes

---

## 📋 Executive Summary

The backend-auth branch contains a good foundation for authentication functionality, but has several **critical issues** that need to be addressed before merging to main:

- **Security Vulnerabilities:** Plain text password comparison (HIGH PRIORITY)
- **Broken DTOs:** LoginRequest and RegisterRequest return hardcoded empty values
- **Package Structure Issues:** Mixed package names (com.calendar vs com.example.backend)
- **Incomplete Implementation:** Missing register and Google login endpoints in com.calendar
- **Code Duplication:** Multiple SecurityConfig and AuthController files
- **Unnecessary Files:** demoGoogleOAuth project should be removed or moved to separate repo

---

## 🔴 Critical Issues (Must Fix Before Merge)

### 1. Security Vulnerability - Plain Text Password Comparison

**File:** `backend/backend/src/main/java/com/calendar/service/AuthService.java`

**Issue:**
```java
// Line 22 - SECURITY VULNERABILITY
if (user == null || !user.getPassword().equals(request.getPassword())) {
```

This compares passwords in **plain text**, which is a critical security vulnerability!

**Fix Required:**
```java
@Autowired
private PasswordEncoder passwordEncoder;

public AuthResponse login(LoginRequest request) {
    User user = userRepository.findByEmail(request.getEmail())
            .orElse(null);
    
    // Use BCrypt to verify password
    if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
        return AuthResponse.builder()
                .message("Invalid email or password")
                .build();
    }
    
    return mapToResponse(user, "Login successful!");
}
```

**Priority:** 🔴 CRITICAL - Must fix immediately

---

### 2. Broken DTO Classes

**Files:** 
- `backend/backend/src/main/java/com/calendar/dto/LoginRequest.java`
- `backend/backend/src/main/java/com/calendar/dto/RegisterRequest.java`

**Issue:**
The DTOs return hardcoded empty values instead of actual field values:

```java
// LoginRequest.java - BROKEN
public String getEmail() {
    return "";  // ❌ Returns empty string instead of actual email
}

public CharSequence getPassword() {
    return null;  // ❌ Returns null instead of actual password
}
```

**Fix Required:**
Use Lombok annotations properly:

```java
package com.calendar.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    private String email;
    private String password;
}
```

Similarly for `RegisterRequest.java`:

```java
package com.calendar.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String email;
    private String password;
    private String displayName;
}
```

**Priority:** 🔴 CRITICAL - Login won't work without this fix

---

### 3. Broken GoogleLoginRequest DTO

**File:** `backend/backend/src/main/java/com/calendar/dto/GoogleLoginRequest.java`

**Issue:**
Missing getters/setters:

```java
public class GoogleLoginRequest {
    private String credential;  // ❌ No getters/setters
}
```

**Fix Required:**
```java
package com.calendar.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoogleLoginRequest {
    private String credential;
}
```

**Priority:** 🔴 CRITICAL - Google login won't work

---

### 4. User Entity Has Empty Methods

**File:** `backend/backend/src/main/java/com/calendar/model/User.java`

**Issue:**
```java
// Lines 52-57 - Broken implementation
public void setFullName(Object fullName) {
    // Empty method body
}

public String getFullName() {
    return "";  // Returns empty string
}
```

**Fix Required:**
Either remove these methods (if fullName is not needed) or implement them properly. Based on the entity, the field is called `displayName`, not `fullName`:

```java
// Remove these broken methods:
// public void setFullName(Object fullName) { }
// public String getFullName() { return ""; }

// The displayName field already has getters/setters via @Data annotation
```

**Priority:** 🟡 MEDIUM - Causes confusion but not breaking

---

## 🟠 High Priority Issues (Should Fix Before Merge)

### 5. Package Structure Confusion

**Issue:**
There are two sets of files with different package structures:

1. **com.calendar package:**
   - AuthController.java (only has `/login` endpoint)
   - AuthService.java (only has login method)
   - User.java, UserRepository.java
   - DTOs (AuthResponse, LoginRequest, RegisterRequest, GoogleLoginRequest)
   - CorsConfig.java
   - SecurityConfig.java (only has PasswordEncoder bean)

2. **com.example.backend package:**
   - AuthController.java (has `/success` and `/test` endpoints for OAuth)
   - SecurityConfig.java (full security configuration with OAuth)
   - BackendApplication.java (main class)

**Problem:**
The main class is in `com.example.backend` package, so Spring Boot will only scan that package and its sub-packages. The `com.calendar` package won't be scanned unless explicitly configured!

**Fix Required:**

**Option 1 (Recommended):** Move all files to one package structure:
```
com.example.backend/
  ├── config/
  │   ├── CorsConfig.java
  │   └── SecurityConfig.java
  ├── controller/
  │   └── AuthController.java
  ├── service/
  │   └── AuthService.java
  ├── model/
  │   └── User.java
  ├── repository/
  │   └── UserRepository.java
  ├── dto/
  │   ├── LoginRequest.java
  │   ├── RegisterRequest.java
  │   ├── GoogleLoginRequest.java
  │   └── AuthResponse.java
  └── BackendApplication.java
```

**Option 2:** Add component scan to BackendApplication:
```java
@SpringBootApplication
@EntityScan("com.calendar.model")
@EnableJpaRepositories("com.calendar.repository")
@ComponentScan({"com.example.backend", "com.calendar"})
public class BackendApplication {
    // ...
}
```

**Priority:** 🟠 HIGH - Current code won't work due to component scanning issues

---

### 6. Missing Endpoints in com.calendar.AuthController

**File:** `backend/backend/src/main/java/com/calendar/controller/AuthController.java`

**Issue:**
Only the `/login` endpoint is implemented. Missing:
- `/register` endpoint (for email/password registration)
- `/google` endpoint (for Google OAuth login)

**Fix Required:**
Add the missing endpoints:

```java
@PostMapping("/register")
public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
    AuthResponse response = authService.register(request);
    return ResponseEntity.ok(response);
}

@PostMapping("/google")
public ResponseEntity<AuthResponse> googleLogin(@RequestBody GoogleLoginRequest request) {
    AuthResponse response = authService.googleLogin(request);
    return ResponseEntity.ok(response);
}
```

And implement the corresponding methods in AuthService.

**Priority:** 🟠 HIGH - Core functionality is missing

---

### 7. Duplicate google-api-client Dependency

**File:** `backend/backend/pom.xml`

**Issue:**
Lines 103-113 have the same dependency declared twice:

```xml
<!-- Lines 103-106 -->
<dependency>
    <groupId>com.google.api-client</groupId>
    <artifactId>google-api-client</artifactId>
    <version>2.2.0</version>
</dependency>

<!-- Lines 108-113 - DUPLICATE -->
<dependency>
    <groupId>com.google.api-client</groupId>
    <artifactId>google-api-client</artifactId>
    <version>2.2.0</version>
</dependency>
```

**Fix Required:**
Remove one of the duplicate entries.

**Priority:** 🟠 HIGH - Code quality issue

---

## 🟡 Medium Priority Issues (Good to Fix)

### 8. Hardcoded Vietnamese Messages

**Files:** Multiple service files

**Issue:**
Error messages are hardcoded in Vietnamese:
- "Sai email hoặc mật khẩu!" (Wrong email or password)
- "Đăng nhập thành công!" (Login successful)

**Recommendation:**
Either:
1. Use English messages (international standard)
2. Implement proper i18n (internationalization)

**Example:**
```java
// Instead of:
.message("Sai email hoặc mật khẩu!")

// Use:
.message("Invalid email or password")
```

**Priority:** 🟡 MEDIUM - Not breaking but affects maintainability

---

### 9. demoGoogleOAuth Project

**Path:** `backend/demoGoogleOAuth/`

**Issue:**
This appears to be a separate demo/test project that was included in the commit. It has:
- Its own pom.xml
- Its own application structure
- HTML templates for login/profile

**Recommendation:**
- Remove this from the main project
- Move to a separate repository if needed for reference
- Or move to a `docs/examples/` folder if it's meant as documentation

**Priority:** 🟡 MEDIUM - Code cleanliness

---

### 10. Missing Register Implementation in AuthService

**File:** `backend/backend/src/main/java/com/calendar/service/AuthService.java`

**Issue:**
Only `login()` method is implemented. The `register()` method is missing.

**Fix Required:**
```java
public AuthResponse register(RegisterRequest request) {
    // Check if email already exists
    if (userRepository.existsByEmail(request.getEmail())) {
        return AuthResponse.builder()
                .message("Email already exists")
                .build();
    }
    
    // Create new user
    User user = User.builder()
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))  // Hash password!
            .displayName(request.getDisplayName())
            .authProvider("local")
            .build();
    
    user = userRepository.save(user);
    
    return mapToResponse(user, "Registration successful!");
}
```

**Priority:** 🟡 MEDIUM - Core functionality

---

### 11. Missing Google Login Implementation

**File:** `backend/backend/src/main/java/com/calendar/service/AuthService.java`

**Issue:**
The `googleLogin()` method is not implemented.

**Fix Required:**
Implement Google token verification:

```java
public AuthResponse googleLogin(GoogleLoginRequest request) {
    // TODO: Implement Google token verification using Google API client
    // 1. Verify the credential token with Google
    // 2. Extract user information from Google
    // 3. Find or create user in database
    // 4. Return user information
    
    throw new UnsupportedOperationException("Google login not yet implemented");
}
```

**Priority:** 🟡 MEDIUM - Feature requirement

---

### 12. No Input Validation

**Files:** All DTOs and Controllers

**Issue:**
No validation annotations on DTOs:

```java
private String email;  // ❌ No @Email validation
private String password;  // ❌ No @NotBlank or @Size validation
```

**Fix Required:**
Add validation annotations:

```java
import jakarta.validation.constraints.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
}
```

And add `@Valid` in controllers:

```java
public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
```

**Priority:** 🟡 MEDIUM - Security and UX improvement

---

### 13. No Error Handling

**Files:** All service and controller files

**Issue:**
No try-catch blocks or custom exception handling. Database errors will expose stack traces to clients.

**Recommendation:**
Add proper exception handling:

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleException(Exception e) {
        Map<String, String> error = new HashMap<>();
        error.put("error", e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
```

**Priority:** 🟡 MEDIUM - Security and UX

---

## 🟢 Minor Issues (Nice to Have)

### 14. Database Credentials in Properties File

**File:** `backend/backend/src/main/resources/application.properties`

**Issue:**
Sensitive credentials are hardcoded:
```properties
spring.datasource.password=G8PXH0Vpzf
spring.security.oauth2.client.registration.google.client-secret=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
```

**Recommendation:**
Use environment variables:
```properties
spring.datasource.password=${DB_PASSWORD}
spring.security.oauth2.client.registration.google.client-secret=${GOOGLE_CLIENT_SECRET}
```

**Priority:** 🟢 LOW - But important for production

---

### 15. Inconsistent Naming

**Files:** Multiple

**Issue:**
- Method names mix Vietnamese and English
- Some use displayName, others use fullName
- Inconsistent response messages

**Recommendation:**
Standardize naming conventions to English throughout the codebase.

**Priority:** 🟢 LOW - Code quality

---

## ✅ What's Done Well

1. ✅ **Lombok Usage:** Good use of @Data, @Builder annotations
2. ✅ **JPA Entities:** User entity is well-structured with timestamps
3. ✅ **Repository Pattern:** UserRepository follows Spring Data JPA conventions
4. ✅ **CORS Configuration:** Properly configured for frontend access
5. ✅ **OAuth2 Setup:** Google OAuth2 configuration is correct in application.properties
6. ✅ **Password Encoder Bean:** SecurityConfig has BCrypt encoder (just not used in service)
7. ✅ **Database Connection Test:** Good debugging feature in BackendApplication

---

## 📝 Summary of Required Actions

### Immediate Actions (Before Merge):
1. 🔴 Fix plain text password comparison - use BCrypt
2. 🔴 Fix broken DTO getters/setters
3. 🔴 Fix package structure or add component scanning
4. 🔴 Add missing endpoints (register, Google login)
5. 🔴 Remove duplicate dependencies

### Recommended Actions:
6. 🟡 Implement register and Google login methods
7. 🟡 Remove or relocate demoGoogleOAuth project
8. 🟡 Add input validation
9. 🟡 Add proper error handling
10. 🟡 Standardize to English messages

### Nice to Have:
11. 🟢 Move secrets to environment variables
12. 🟢 Add comprehensive tests
13. 🟢 Add API documentation (Swagger/OpenAPI)

---

## 🎯 Recommendation

**DO NOT MERGE** until critical issues (items 1-5) are fixed.

The code shows good understanding of Spring Boot architecture but needs refinement in:
- Security practices
- Package organization
- Implementation completeness

Estimated time to fix critical issues: **2-4 hours**

---

## 📞 Next Steps

1. Create a new branch from `backend-auth` to fix issues
2. Fix critical issues first (items 1-5)
3. Test the fixes with Postman or frontend
4. Submit updated code for re-review
5. Once approved, merge to main

---

**Reviewed by:** GitHub Copilot AI  
**Review Date:** January 8, 2026
