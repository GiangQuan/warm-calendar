# Quick Fix Guide for Backend Auth Branch

This guide shows you exactly how to fix the critical issues in the backend-auth branch.

## 🚨 Critical Fixes Required

### Fix 1: Update LoginRequest.java

**Location:** `backend/backend/src/main/java/com/calendar/dto/LoginRequest.java`

**Replace the entire file with:** `fixes/dto/LoginRequest.java`

**Key changes:**
- Use `@Data` annotation to auto-generate getters/setters
- Remove the broken manual getters that return empty strings
- Add validation annotations

---

### Fix 2: Update RegisterRequest.java

**Location:** `backend/backend/src/main/java/com/calendar/dto/RegisterRequest.java`

**Replace the entire file with:** `fixes/dto/RegisterRequest.java`

**Key changes:**
- Use `@Data` annotation to auto-generate getters/setters
- Remove the broken manual getters that return empty strings
- Remove `getFullName()` method (field is called `displayName`)
- Add validation annotations

---

### Fix 3: Update GoogleLoginRequest.java

**Location:** `backend/backend/src/main/java/com/calendar/dto/GoogleLoginRequest.java`

**Replace the entire file with:** `fixes/dto/GoogleLoginRequest.java`

**Key changes:**
- Add `@Data` annotation to auto-generate getters/setters
- Add validation annotations

---

### Fix 4: Update User.java

**Location:** `backend/backend/src/main/java/com/calendar/model/User.java`

**Replace the entire file with:** `fixes/model/User.java`

**Key changes:**
- Remove broken `setFullName()` and `getFullName()` methods
- Lombok's `@Data` already provides getters/setters for `displayName`

---

### Fix 5: Update AuthService.java - MOST IMPORTANT!

**Location:** `backend/backend/src/main/java/com/calendar/service/AuthService.java`

**Replace the entire file with:** `fixes/service/AuthService.java`

**Key changes:**
- ✅ **CRITICAL:** Use `passwordEncoder.matches()` instead of plain text comparison
- Add `@Autowired PasswordEncoder passwordEncoder`
- Implement the `register()` method with password hashing
- Add `googleLogin()` method stub
- Change Vietnamese messages to English
- Add basic error handling

**Before (INSECURE):**
```java
if (user == null || !user.getPassword().equals(request.getPassword())) {
```

**After (SECURE):**
```java
if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
```

---

### Fix 6: Update AuthController.java

**Location:** `backend/backend/src/main/java/com/calendar/controller/AuthController.java`

**Replace the entire file with:** `fixes/controller/AuthController.java`

**Key changes:**
- Add `@Valid` annotation to enable validation
- Add missing `/register` endpoint
- Add missing `/google` endpoint

---

### Fix 7: Update pom.xml - Remove Duplicate Dependency

**Location:** `backend/backend/pom.xml`

**Find this section around lines 103-113:**
```xml
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

**Remove one of the duplicate entries** - keep only one.

---

### Fix 8: Fix Package Structure

**Problem:** Spring Boot main class is in `com.example.backend` package, but most of your new code is in `com.calendar` package. Spring Boot won't scan the `com.calendar` package by default!

**Solution - Option 1 (Recommended):** Move all `com.calendar` files to `com.example.backend`

Move files from:
- `src/main/java/com/calendar/model/` → `src/main/java/com/example/backend/model/`
- `src/main/java/com/calendar/dto/` → `src/main/java/com/example/backend/dto/`
- `src/main/java/com/calendar/service/` → `src/main/java/com/example/backend/service/`
- `src/main/java/com/calendar/repository/` → `src/main/java/com/example/backend/repository/`
- `src/main/java/com/calendar/controller/` → `src/main/java/com/example/backend/controller/`
- `src/main/java/com/calendar/config/` → `src/main/java/com/example/backend/config/`

And update package declarations in each file.

**Solution - Option 2 (Quick fix):** Add component scanning to BackendApplication.java

```java
package com.example.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import javax.sql.DataSource;
import java.sql.Connection;

@SpringBootApplication
@EntityScan({"com.example.backend.model", "com.calendar.model"})
@EnableJpaRepositories({"com.example.backend.repository", "com.calendar.repository"})
@ComponentScan({"com.example.backend", "com.calendar"})
public class BackendApplication {
    // ... rest of the code
}
```

---

## ✅ Testing Your Fixes

### 1. Build the project:
```bash
cd backend/backend
./mvnw clean install
```

### 2. Run the application:
```bash
./mvnw spring-boot:run
```

### 3. Test with curl or Postman:

**Test register:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "displayName": "Test User"
  }'
```

**Test login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## 📋 Checklist

After applying all fixes, verify:

- [ ] All DTOs have `@Data` annotation and no manual broken getters
- [ ] AuthService uses `passwordEncoder.matches()` for password verification
- [ ] AuthService uses `passwordEncoder.encode()` when creating new users
- [ ] AuthController has `/login`, `/register`, and `/google` endpoints
- [ ] All endpoints have `@Valid` annotation
- [ ] No duplicate dependencies in pom.xml
- [ ] Package structure is fixed (all files in one package or component scan added)
- [ ] User entity has no broken fullName methods
- [ ] Application compiles without errors: `./mvnw clean install`
- [ ] Application runs: `./mvnw spring-boot:run`
- [ ] Can register a new user via API
- [ ] Can login with registered user via API
- [ ] Password is stored as hash in database (not plain text)

---

## 🎯 Priority Order

Fix in this order:
1. **Fix 5** - AuthService password security (MOST CRITICAL)
2. **Fix 1, 2, 3** - DTOs (required for AuthService to work)
3. **Fix 4** - User entity (small but important)
4. **Fix 6** - AuthController (add missing endpoints)
5. **Fix 8** - Package structure (required for everything to work)
6. **Fix 7** - pom.xml duplicate (cleanup)

---

## 🆘 Need Help?

If you encounter errors:

1. Check console output for specific error messages
2. Verify all imports are correct
3. Make sure Lombok is working (check if @Data generates getters/setters)
4. Run `./mvnw clean install` to rebuild
5. Check that MySQL database is accessible

---

**Estimated time to apply all fixes:** 1-2 hours

Good luck! 🚀
