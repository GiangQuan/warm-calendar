# Tien Son: Backend Developer (Event Focus)

## Nhiệm vụ
Xây dựng **Event API** - quản lý CRUD cho calendar events.

---

## Checklist

### Setup
- [ ] Clone repo từ Leader
- [ ] Mở folder `backend/` trong IntelliJ
- [ ] Chạy app để test database connection
- [ ] Tạo branch: `git checkout -b backend-events`

---

### Task 1: Tạo Event Entity
File: `src/main/java/com/calendar/model/Event.java`

```java
package com.calendar.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private LocalDate date;

    private String time;

    @Column(nullable = false)
    private String color = "primary";

    @Column(nullable = false)
    private String recurrence = "none";

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "meeting_link")
    private String meetingLink;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

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

### Task 2: Tạo EventRepository
File: `src/main/java/com/calendar/repository/EventRepository.java`

```java
package com.calendar.repository;

import com.calendar.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByUserIdOrderByDateAsc(Long userId);
}
```

---

### Task 3: Tạo EventDto
File: `src/main/java/com/calendar/dto/EventDto.java`

```java
package com.calendar.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventDto {
    private Long id;
    private String title;
    private LocalDate date;
    private String time;
    private String color;
    private String recurrence;
    private LocalDate endDate;
    private String meetingLink;
    private Long userId;
}
```

---

### Task 4: Tạo EventService
File: `src/main/java/com/calendar/service/EventService.java`

| Method | Mô tả |
|--------|-------|
| `getEventsByUserId(Long userId)` | Lấy tất cả events của user |
| `createEvent(EventDto dto)` | Tạo event mới |
| `updateEvent(Long id, EventDto dto)` | Cập nhật event |
| `deleteEvent(Long id)` | Xóa event |

---

### Task 5: Tạo EventController
File: `src/main/java/com/calendar/controller/EventController.java`

| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/api/events?userId={id}` | GET | Lấy events của user |
| `/api/events` | POST | Tạo event mới |
| `/api/events/{id}` | PUT | Cập nhật event |
| `/api/events/{id}` | DELETE | Xóa event |

---

## Khi hoàn thành
```bash
git add .
git commit -m "Add Event CRUD API"
git push origin backend-events
```
Tạo **Pull Request** → Báo Leader review
