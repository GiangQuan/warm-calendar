# Leader Tasks (GiangQuan) - Frontend + PM

## Vai trò
- **Project Manager**: Setup, phân công, review code
- **Frontend Lead**: Refactor React để dùng Spring Boot API

---

## Timeline
```
Day 1: Setup (Bạn làm TRƯỚC)
Day 2-4: Development song song
Day 5: Integration & Testing
```

---

## Day 1: Project Setup

### Step 1: GitHub Repository
- [ ] Tạo repo mới trên github.com
- [ ] Add teammates làm collaborators
- [ ] Tạo branches: `main`, `backend-auth`, `backend-events`

### Step 2: Google OAuth Setup
1. Vào [Google Cloud Console](https://console.cloud.google.com)
2. Tạo project mới → Name: `Warm Calendar`
3. **APIs & Services** → **OAuth consent screen** → External
4. **Credentials** → **Create OAuth 2.0 Client IDs**
   - Authorized origins: `http://localhost:5173`
   - Authorized redirect: `http://localhost:5173`
5. Copy **Client ID** → Lưu lại

### Step 3: Database Tables
Chạy SQL này trong **DataGrip**:

```sql
    CREATE TABLE users (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255),
        display_name VARCHAR(255),
        avatar_url VARCHAR(500),
        google_id VARCHAR(255) UNIQUE,
        auth_provider VARCHAR(50) DEFAULT 'local',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    CREATE TABLE events (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        time VARCHAR(10),
        color VARCHAR(50) DEFAULT 'primary',
        recurrence VARCHAR(50) DEFAULT 'none',
        end_date DATE,
        meeting_link VARCHAR(500),
        user_id BIGINT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
```

### Step 4: Gửi task cho team
- [ ] Gửi `FRIEND1_BACKEND_TASKS.md` cho Người 1 (Auth)
- [ ] Gửi `FRIEND2_BACKEND_TASKS.md` cho Người 2 (Events)
- [ ] Gửi **Google Client ID** cho Người 1

---

## Day 2-4: Frontend Development

### Task 1: Cài đặt packages
```bash
npm install @react-oauth/google
npm uninstall @supabase/supabase-js
```

### Task 2: Xóa Supabase
- [ ] Xóa folder `src/integrations/`

### Task 3: Tạo API Service
Create: `src/services/api.ts`

```typescript
const API_URL = 'http://localhost:8080/api';

export const api = {
  register: (data: { email: string; password: string; displayName: string }) =>
    fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => res.json()),

  login: (data: { email: string; password: string }) =>
    fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => res.json()),

  googleLogin: (credential: string) =>
    fetch(`${API_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential }),
    }).then(res => res.json()),

  getEvents: (userId: number) =>
    fetch(`${API_URL}/events?userId=${userId}`).then(res => res.json()),

  createEvent: (event: any) =>
    fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    }).then(res => res.json()),

  updateEvent: (id: number, event: any) =>
    fetch(`${API_URL}/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    }).then(res => res.json()),

  deleteEvent: (id: number) =>
    fetch(`${API_URL}/events/${id}`, { method: 'DELETE' }),
};
```

### Task 4: Thêm Google Provider
Edit: `src/main.tsx`

```tsx
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = 'YOUR_CLIENT_ID';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);
```

### Task 5-7: Update Components
- [ ] Thêm Google Login Button (`src/pages/Auth.tsx`)
- [ ] Update AuthContext (`src/contexts/AuthContext.tsx`)
- [ ] Update useCalendarEvents (`src/hooks/useCalendarEvents.ts`)

---

## Day 5: Integration

- [ ] Merge `backend-auth` → `main`
- [ ] Merge `backend-events` → `main`
- [ ] Test full flow
- [ ] Demo cho mentor
