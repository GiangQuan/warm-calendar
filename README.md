<p align="center">
  <img src="https://img.icons8.com/3d-fluency/94/calendar.png" alt="Warm Calendar Logo" width="120"/>
</p>

<h1 align="center">🗓️ Warm Calendar</h1>

<p align="center">
  <strong>A beautiful, modern personal calendar application with Vietnamese Lunar support</strong>
</p>

<p align="center">
  <a href="#-features"><img src="https://img.shields.io/badge/Features-✨-blue?style=for-the-badge" alt="Features"/></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Stack-Modern-purple?style=for-the-badge" alt="Tech Stack"/></a>
  <a href="#-getting-started"><img src="https://img.shields.io/badge/Setup-Easy-green?style=for-the-badge" alt="Setup"/></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=flat-square&logo=spring-boot&logoColor=white" alt="Spring Boot"/>
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/MySQL-8.x-4479A1?style=flat-square&logo=mysql&logoColor=white" alt="MySQL"/>
  <img src="https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="TailwindCSS"/>
</p>

---

## ✨ Features

<table>
  <tr>
    <td align="center" width="25%">
      <img src="https://img.icons8.com/fluency/48/calendar--v1.png" alt="Calendar Views"/>
      <br><strong>📅 Month & Week Views</strong>
      <br><sub>Switch between views & track Vietnamese Lunar dates</sub>
    </td>
    <td align="center" width="25%">
      <img src="https://img.icons8.com/fluency/48/drag-and-drop.png" alt="Drag & Drop"/>
      <br><strong>🖱️ Drag & Drop</strong>
      <br><sub>Intuitive rescheduling for all your events</sub>
    </td>
    <td align="center" width="25%">
      <img src="https://img.icons8.com/fluency/48/recurring-appointment.png" alt="Recurring"/>
      <br><strong>🔁 Recurring Events</strong>
      <br><sub>Daily, weekly, or monthly flexible recurrence</sub>
    </td>
    <td align="center" width="25%">
      <img src="https://img.icons8.com/fluency/48/google-meet.png" alt="Meeting Links"/>
      <br><strong>🔗 Meeting Links</strong>
      <br><sub>Attach and join video meetings directly</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="25%">
      <img src="https://img.icons8.com/fluency/48/settings.png" alt="Settings"/>
      <br><strong>⚙️ Global Settings</strong>
      <br><sub>Language (VI/EN), Lunar toggle, & Notifications</sub>
    </td>
    <td align="center" width="25%">
      <img src="https://img.icons8.com/fluency/48/email.png" alt="Support"/>
      <br><strong>📩 Support Form</strong>
      <br><sub>Direct support emails powered by EmailJS</sub>
    </td>
    <td align="center" width="25%">
      <img src="https://img.icons8.com/fluency/48/google-logo.png" alt="Google OAuth"/>
      <br><strong>🔐 Smart OAuth</strong>
      <br><sub>Secure Google login with account selection</sub>
    </td>
    <td align="center" width="25%">
      <img src="https://img.icons8.com/fluency/48/database.png" alt="Cloud Sync"/>
      <br><strong>☁️ Cloud Sync</strong>
      <br><sub>Persistent storage with MySQL & JWT Auth</sub>
    </td>
  </tr>
</table>

---

## 🛠️ Tech Stack

<table>
  <tr>
    <th align="center">🎨 Frontend</th>
    <th align="center">⚙️ Backend</th>
    <th align="center">🗃️ Services</th>
    <th align="center">🔒 Security</th>
  </tr>
  <tr>
    <td>
      <ul>
        <li>React 18 + Vite</li>
        <li>TypeScript</li>
        <li>TailwindCSS + shadcn/ui</li>
        <li>Date-fns + dnd-kit</li>
      </ul>
    </td>
    <td>
      <ul>
        <li>Spring Boot 3.x</li>
        <li>Java 17</li>
        <li>Spring Data JPA</li>
        <li>Hibernate</li>
      </ul>
    </td>
    <td>
      <ul>
        <li>MySQL 8.x</li>
        <li>EmailJS (Support)</li>
        <li>Google OAuth 2.0</li>
      </ul>
    </td>
    <td>
      <ul>
        <li>Spring Security</li>
        <li>JWT + Session</li>
        <li>BCrypt Password Hash</li>
      </ul>
    </td>
  </tr>
</table>

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       📱 Frontend (React)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │ Calendar UI │  │ AuthContext │  │     SettingsContext     │ │
│  └──────┬──────┘  └──────┬──────┘  └────────────┬────────────┘ │
│         └────────────────┼──────────────────────┘              │
│                          ▼                                      │
│                    ┌──────────┐      📤 [EmailJS API]           │
│                    │  api.ts  ├───────> (Support Form)          │
│                    └────┬─────┘                                 │
└─────────────────────────┼───────────────────────────────────────┘
                          │ HTTP/REST (Credentials: include)
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ⚙️ Backend (Spring Boot)                     │
│  ┌─────────────────────────┐   ┌─────────────────────────────┐ │
│  │    Auth Module          │   │      Event Module           │ │
│  └─────────────────────────┘   └──────────────┬──────────────┘ │
│                │                              │                │
│                ▼                              ▼                │
│        ┌───────────────┐              ┌────────────────┐       │
│        │ User Repos    │              │ Event Repos    │       │
│        └───────────────┘              └────────────────┘       │
└─────────────────────────────────┬───────────────────────────────┘
                                  │ JPA/Hibernate
                                  ▼
                        ┌───────────────────┐
                        │   🗃️ MySQL 8.x    │
                        └───────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Java 17+**
- **Node.js 18+**
- **MySQL 8.x**

### 1️⃣ Clone & Setup

```powershell
git clone https://github.com/GiangQuan/warm-calendar.git
cd warm-calendar
```

### 2️⃣ Backend Configuration

Create a database `admin_calendar`. Update `backend/backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/admin_calendar
spring.datasource.username=your_user
spring.datasource.password=your_pass

# Google OAuth Keys
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret
```

### 3️⃣ Frontend Configuration

Create `frontend/.env` (copy from `.env.example`):

```env
VITE_API_URL=http://localhost:8080/api

# EmailJS Keys (for Support Form)
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

### 4️⃣ Execution

**Run Backend:**

```powershell
cd backend/backend
.\mvnw.cmd spring-boot:run
```

**Run Frontend:**

```powershell
cd frontend
npm install
npm run dev
```

---

## 📡 API Reference

| Method | Endpoint             | Description               |
| :----: | :------------------- | :------------------------ |
| `POST` | `/api/auth/login`    | Login with credentials    |
| `GET`  | `/api/auth/success`  | Google OAuth callback     |
| `GET`  | `/api/events`        | Fetch all user events     |
| `POST` | `/api/events`        | Create new event          |
| `PUT`  | `/api/auth/update`   | Update user profile       |
| `POST` | `/api/upload/avatar` | Upload local avatar image |

---

## 👥 Team

- **GiangQuan**: 🎨 Frontend + Project Lead
- **Thu Trang**: 🔐 Backend Authentication
- **Tien Son**: 📅 Backend Calendar Events

---

<p align="center">
  Made with ❤️ by the <strong>Warm Calendar Team</strong>
</p>
