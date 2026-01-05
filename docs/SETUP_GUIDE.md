# 🚀 Hướng dẫn Setup cho Teammates

## Yêu cầu
- **Java 17+** (kiểm tra: `java -version`)
- **Maven** (có sẵn trong project, không cần cài)

## Các bước chạy Backend

### 1. Clone repo và checkout branch của bạn
```bash
git clone https://github.com/[username]/warm-calendar.git
cd warm-calendar

# Người 1 (Auth):
git checkout backend-auth

# Người 2 (Events):
git checkout backend-events
```

### 2. Di chuyển vào folder backend
```bash
cd backend/backend
```

### 3. Chạy project
**Windows:**
```powershell
.\mvnw.cmd spring-boot:run
```

**Mac/Linux:**
```bash
./mvnw spring-boot:run
```

### 4. Kiểm tra
- Truy cập: http://localhost:8080
- Nếu thấy "Whitelabel Error Page" = **thành công!** (chưa có endpoint nào)

---

## ❌ Lỗi thường gặp

### "JAVA_HOME is not set"
→ Cài Java 17 và set biến môi trường JAVA_HOME

### "Port 8080 already in use"
→ Tắt ứng dụng khác đang dùng port 8080, hoặc chạy:
```powershell
# Windows
netstat -ano | findstr :8080
taskkill /PID [PID_NUMBER] /F
```

### "Cannot connect to database"
→ Kiểm tra kết nối internet (database ở server remote)

---

## 📁 Cấu trúc thư mục để code

```
backend/backend/src/main/java/com/example/backend/
├── BackendApplication.java (đã có)
├── controller/     ← Tạo các Controller ở đây
├── service/        ← Tạo các Service ở đây
├── repository/     ← Tạo các Repository ở đây
├── entity/         ← Tạo các Entity ở đây
├── dto/            ← Tạo các DTO ở đây
└── config/         ← Tạo các Config ở đây
```
