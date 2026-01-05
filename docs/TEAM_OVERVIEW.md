# Team Plan Overview

## Team Members
| Vai trò | Người | Branch | Trách nhiệm |
|---------|-------|--------|-------------|
| Backend Auth | Người 1 | `backend-auth` | User, Login, Google OAuth |
| Backend Event | Người 2 | `backend-events` | Events CRUD API |
| Frontend + PM | **Bạn** | `main` | React, API integration, quản lý team |

---

## Timeline (5 ngày)

```mermaid
gantt
    title Project Timeline
    dateFormat  YYYY-MM-DD
    section Leader
    Setup & Database       :a1, 2026-01-05, 1d
    Frontend Development   :a2, 2026-01-06, 3d
    Integration            :a3, 2026-01-09, 1d
    section Người 1
    Auth API               :b1, 2026-01-06, 3d
    section Người 2
    Event API              :c1, 2026-01-06, 3d
```

---

## Kiến trúc hệ thống

```mermaid
flowchart TB
    subgraph Frontend["Frontend (React)"]
        UI[Calendar UI]
        API[api.ts]
        Auth[AuthContext]
    end
    
    subgraph Backend["Backend (Spring Boot)"]
        subgraph AuthModule["Người 1"]
            AC[AuthController]
            AS[AuthService]
            UR[UserRepository]
        end
        subgraph EventModule["Người 2"]
            EC[EventController]
            ES[EventService]
            ER[EventRepository]
        end
    end
    
    subgraph Database["MySQL"]
        DB[(103.150.125.181)]
    end
    
    UI --> API
    API --> AC
    API --> EC
    AC --> AS --> UR --> DB
    EC --> ES --> ER --> DB
```

---

## Task Documents
| File | Cho ai |
|------|--------|
| [LEADER_TASKS.md](./LEADER_TASKS.md) | Bạn (Frontend + PM) |
| [FRIEND1_BACKEND_TASKS.md](./FRIEND1_BACKEND_TASKS.md) | Người 1 (Auth) |
| [FRIEND2_BACKEND_TASKS.md](./FRIEND2_BACKEND_TASKS.md) | Người 2 (Events) |

---

## Phân chia công việc

| Task | Leader | Nguoi 1 | Nguoi 2 |
|------|:------:|:-------:|:-------:|
| GitHub Setup | ● | | |
| Database Schema | ● | | |
| Google Cloud Config | ● | | |
| User Entity | | ● | |
| Event Entity | | | ● |
| UserRepository | | ● | |
| EventRepository | | | ● |
| AuthService | | ● | |
| EventService | | | ● |
| AuthController | | ● | |
| EventController | | | ● |
| CorsConfig | | ● | |
| api.ts | ● | | |
| AuthContext | ● | | |
| useCalendarEvents | ● | | |
| Code Review | ● | | |
| Integration | ● | | |

```mermaid
flowchart LR
    subgraph Leader["Leader (GiangQuan)"]
        L1[GitHub Setup]
        L2[Database Tables]
        L3[Google OAuth Config]
        L4[api.ts]
        L5[AuthContext]
        L6[useCalendarEvents]
        L7[Code Review]
    end
    
    subgraph Nguoi1["Nguoi 1 - Auth"]
        A1[User Entity]
        A2[UserRepository]
        A3[Auth DTOs]
        A4[AuthService]
        A5[AuthController]
        A6[CorsConfig]
    end
    
    subgraph Nguoi2["Nguoi 2 - Events"]
        E1[Event Entity]
        E2[EventRepository]
        E3[EventDto]
        E4[EventService]
        E5[EventController]
    end
```

---

## Git Branches
```
main (protected)
├── backend-auth (Người 1)
├── backend-events (Người 2)
```

