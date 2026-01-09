---
description: Step-by-step guide to implement notification system for Warm Calendar
---

# 🔔 Notification System Implementation Guide

This guide will walk you through implementing **Browser Push Notifications** + **Email Notifications** for your calendar app.

---

## 📦 PHASE 1: Database & Model Changes

### Step 1.1: Update Event Entity (Backend)

**File:** `backend/backend/src/main/java/com/example/backend/model/Event.java`

Add these fields after `meetingLink`:

```java
@Builder.Default
@Column(name = "reminder_enabled")
private Boolean reminderEnabled = true;

@Builder.Default
@Column(name = "reminder_minutes")
private Integer reminderMinutes = 15;
```

---

### Step 1.2: Update EventDto (Backend)

**File:** `backend/backend/src/main/java/com/example/backend/dto/EventDto.java`

Add these fields to the DTO class:

```java
private Boolean reminderEnabled;
private Integer reminderMinutes;
```

---

### Step 1.3: Update EventService (Backend)

**File:** `backend/backend/src/main/java/com/example/backend/service/EventService.java`

Update the `convertToDto` method to include:

```java
.reminderEnabled(event.getReminderEnabled())
.reminderMinutes(event.getReminderMinutes())
```

Update the `convertToEntity` method to include:

```java
.reminderEnabled(dto.getReminderEnabled() != null ? dto.getReminderEnabled() : true)
.reminderMinutes(dto.getReminderMinutes() != null ? dto.getReminderMinutes() : 15)
```

Update the `updateEvent` method to include:

```java
event.setReminderEnabled(dto.getReminderEnabled());
event.setReminderMinutes(dto.getReminderMinutes());
```

---

### Step 1.4: Database Migration

Run this SQL on your MySQL database, OR let Hibernate auto-update:

```sql
ALTER TABLE events ADD COLUMN reminder_enabled BOOLEAN DEFAULT TRUE;
ALTER TABLE events ADD COLUMN reminder_minutes INT DEFAULT 15;
```

**Hibernate auto-update:** If you have `spring.jpa.hibernate.ddl-auto=update` in application.properties, just restart the backend.

---

## 📦 PHASE 2: Frontend - UI for Reminder Settings

### Step 2.1: Update Calendar Types

**File:** `frontend/src/types/calendar.ts`

Add to `CalendarEvent` interface:

```typescript
reminderEnabled?: boolean;
reminderMinutes?: number;
```

---

### Step 2.2: Update AddEventForm

**File:** `frontend/src/components/calendar/AddEventForm.tsx`

1. **Add imports at top:**

```typescript
import { Bell, BellOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
```

2. **Add state for reminder:**

```typescript
const [reminderEnabled, setReminderEnabled] = useState(true);
const [reminderMinutes, setReminderMinutes] = useState(15);
```

3. **Add UI after meeting link field:**

```tsx
{
  /* Reminder Settings */
}
<div className="space-y-3 pt-2 border-t">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      {reminderEnabled ? (
        <Bell className="h-4 w-4 text-primary" />
      ) : (
        <BellOff className="h-4 w-4 text-muted-foreground" />
      )}
      <Label htmlFor="reminder-toggle">Reminder</Label>
    </div>
    <Switch
      id="reminder-toggle"
      checked={reminderEnabled}
      onCheckedChange={setReminderEnabled}
    />
  </div>

  {reminderEnabled && (
    <Select
      value={reminderMinutes.toString()}
      onValueChange={(val) => setReminderMinutes(parseInt(val))}
    >
      <SelectTrigger>
        <SelectValue placeholder="Remind me before..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="5">5 minutes before</SelectItem>
        <SelectItem value="10">10 minutes before</SelectItem>
        <SelectItem value="15">15 minutes before</SelectItem>
        <SelectItem value="30">30 minutes before</SelectItem>
        <SelectItem value="60">1 hour before</SelectItem>
        <SelectItem value="1440">1 day before</SelectItem>
      </SelectContent>
    </Select>
  )}
</div>;
```

4. **Update the submit handler to include:**

```typescript
onAddEvent({
  // ... existing fields
  reminderEnabled,
  reminderMinutes,
});
```

5. **Reset state in useEffect when dialog closes:**

```typescript
setReminderEnabled(true);
setReminderMinutes(15);
```

---

### Step 2.3: Update EditEventForm Similarly

**File:** `frontend/src/components/calendar/EditEventForm.tsx`

Apply the same changes as AddEventForm, but initialize from event props:

```typescript
const [reminderEnabled, setReminderEnabled] = useState(
  event?.reminderEnabled ?? true
);
const [reminderMinutes, setReminderMinutes] = useState(
  event?.reminderMinutes ?? 15
);
```

---

## 📦 PHASE 3: Browser Push Notifications

### Step 3.1: Create Notification Hook

**File:** `frontend/src/hooks/useNotifications.ts` (NEW FILE)

```typescript
import { useEffect, useCallback, useRef } from "react";
import { CalendarEvent } from "@/types/calendar";
import { format, parseISO, isToday, isTomorrow } from "date-fns";

export function useNotifications(events: CalendarEvent[]) {
  const scheduledNotifications = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Request permission
  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }

    return false;
  }, []);

  // Show notification
  const showNotification = useCallback((event: CalendarEvent) => {
    if (Notification.permission !== "granted") return;

    const notification = new Notification(`📅 ${event.title}`, {
      body: `Starting ${event.time ? `at ${event.time}` : "soon"}`,
      icon: "/gemini-logo.png",
      tag: event.id, // Prevents duplicate notifications
      requireInteraction: true,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }, []);

  // Schedule notifications for events
  const scheduleNotifications = useCallback(() => {
    // Clear existing scheduled notifications
    scheduledNotifications.current.forEach((timeout) => clearTimeout(timeout));
    scheduledNotifications.current.clear();

    const now = new Date();

    events.forEach((event) => {
      if (!event.reminderEnabled || !event.time) return;

      const eventDate = new Date(event.date);
      const [hours, minutes] = event.time.split(":").map(Number);
      eventDate.setHours(hours, minutes, 0, 0);

      // Calculate notification time
      const reminderMinutes = event.reminderMinutes || 15;
      const notificationTime = new Date(
        eventDate.getTime() - reminderMinutes * 60 * 1000
      );

      // Only schedule if notification time is in the future
      const delay = notificationTime.getTime() - now.getTime();
      if (delay > 0 && delay < 24 * 60 * 60 * 1000) {
        // Within 24 hours
        const timeout = setTimeout(() => {
          showNotification(event);
        }, delay);

        scheduledNotifications.current.set(event.id, timeout);
        console.log(
          `🔔 Scheduled notification for "${event.title}" in ${Math.round(
            delay / 60000
          )} minutes`
        );
      }
    });
  }, [events, showNotification]);

  // Request permission on mount
  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  // Reschedule when events change
  useEffect(() => {
    scheduleNotifications();

    return () => {
      scheduledNotifications.current.forEach((timeout) =>
        clearTimeout(timeout)
      );
    };
  }, [scheduleNotifications]);

  return {
    requestPermission,
    isSupported: "Notification" in window,
    permission:
      typeof window !== "undefined" ? Notification.permission : "default",
  };
}
```

---

### Step 3.2: Use the Hook in Calendar Page

**File:** `frontend/src/pages/Calendar.tsx`

1. **Import the hook:**

```typescript
import { useNotifications } from "@/hooks/useNotifications";
```

2. **Use it after the events hook:**

```typescript
const { events, addEvent, updateEvent, removeEvent, getEventsForDate } =
  useCalendarEvents();
const { permission, requestPermission } = useNotifications(events);
```

3. **(Optional) Add permission request button if not granted:**

```tsx
{
  permission === "default" && (
    <Button
      variant="outline"
      size="sm"
      onClick={requestPermission}
      className="gap-2"
    >
      <Bell className="h-4 w-4" />
      Enable Notifications
    </Button>
  );
}
```

---

## 📦 PHASE 4: Email Notifications (Backend)

### Step 4.1: Add Spring Mail Dependency

**File:** `backend/backend/pom.xml`

Add inside `<dependencies>`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

---

### Step 4.2: Configure SMTP

**File:** `backend/backend/src/main/resources/application.properties`

Add these properties (example using Gmail):

```properties
# Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

**For Gmail:** Create an App Password at https://myaccount.google.com/apppasswords

**File:** `backend/backend/.env`

Add:

```
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

---

### Step 4.3: Create NotificationService

**File:** `backend/backend/src/main/java/com/example/backend/service/NotificationService.java` (NEW FILE)

```java
package com.example.backend.service;

import com.example.backend.model.Event;
import com.example.backend.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final JavaMailSender mailSender;

    public void sendEventReminder(Event event, User user) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("📅 Reminder: " + event.getTitle());
            message.setText(buildEmailBody(event));

            mailSender.send(message);
            log.info("✅ Reminder email sent for event '{}' to {}", event.getTitle(), user.getEmail());
        } catch (Exception e) {
            log.error("❌ Failed to send reminder email: {}", e.getMessage());
        }
    }

    private String buildEmailBody(Event event) {
        StringBuilder body = new StringBuilder();
        body.append("Hi! This is a reminder for your upcoming event:\n\n");
        body.append("📌 ").append(event.getTitle()).append("\n");
        body.append("📅 Date: ").append(event.getDate()).append("\n");
        if (event.getTime() != null) {
            body.append("⏰ Time: ").append(event.getTime()).append("\n");
        }
        if (event.getMeetingLink() != null) {
            body.append("🔗 Meeting Link: ").append(event.getMeetingLink()).append("\n");
        }
        body.append("\n— Warm Calendar");
        return body.toString();
    }
}
```

---

### Step 4.4: Create Reminder Scheduler

**File:** `backend/backend/src/main/java/com/example/backend/scheduler/ReminderScheduler.java` (NEW FILE)

```java
package com.example.backend.scheduler;

import com.example.backend.model.Event;
import com.example.backend.repository.EventRepository;
import com.example.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ReminderScheduler {

    private final EventRepository eventRepository;
    private final NotificationService notificationService;

    // Run every minute
    @Scheduled(fixedRate = 60000)
    public void checkAndSendReminders() {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        // Find events for today with reminders enabled
        List<Event> todayEvents = eventRepository.findByDateAndReminderEnabled(today, true);

        for (Event event : todayEvents) {
            if (event.getTime() == null) continue;

            LocalTime eventTime = LocalTime.parse(event.getTime());
            LocalTime reminderTime = eventTime.minusMinutes(event.getReminderMinutes());

            // Check if current time is within the reminder window (1 minute tolerance)
            if (now.isAfter(reminderTime.minusSeconds(30)) && now.isBefore(reminderTime.plusSeconds(30))) {
                log.info("🔔 Sending reminder for event: {}", event.getTitle());
                notificationService.sendEventReminder(event, event.getUser());
            }
        }
    }
}
```

---

### Step 4.5: Add Repository Query

**File:** `backend/backend/src/main/java/com/example/backend/repository/EventRepository.java`

Add this method:

```java
List<Event> findByDateAndReminderEnabled(LocalDate date, Boolean reminderEnabled);
```

---

### Step 4.6: Enable Scheduling

**File:** `backend/backend/src/main/java/com/example/backend/BackendApplication.java`

Add `@EnableScheduling` annotation:

```java
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling  // ADD THIS
public class BackendApplication {
    // ...
}
```

---

## ✅ Testing Checklist

### Backend Tests:

- [ ] Restart backend, check Hibernate creates new columns
- [ ] Create event via API, verify `reminderEnabled` and `reminderMinutes` saved
- [ ] Check logs for scheduled task running every minute

### Frontend Tests:

- [ ] Open browser DevTools → Console, look for "Scheduled notification" logs
- [ ] Create event 5 minutes from now with 5-min reminder
- [ ] Wait and verify browser notification appears
- [ ] Test notification click opens calendar

### Email Tests:

- [ ] Verify SMTP credentials in .env
- [ ] Create event with time set to 15 min from now
- [ ] Wait for scheduler to send email
- [ ] Check inbox (and spam folder)

---

## 🐛 Troubleshooting

### Browser notifications not showing?

1. Check `Notification.permission` in browser console
2. Ensure site is served over HTTPS (or localhost)
3. Check Windows notification settings (Win + I → System → Notifications)

### Emails not sending?

1. Check backend logs for errors
2. Verify Gmail App Password (not regular password)
3. Enable "Less secure app access" if needed
4. Check spam folder

### Scheduler not running?

1. Verify `@EnableScheduling` on main class
2. Check logs for "Sending reminder" messages
3. Ensure backend is running when event time approaches

---

## 🎉 Done!

After completing all steps, your calendar will have:

- ✅ Reminder toggle on event forms
- ✅ Customizable reminder time (5 min to 1 day)
- ✅ Browser notifications when tab is open
- ✅ Email reminders even when offline

**Next enhancements to consider:**

- Notification log table to prevent duplicate emails
- HTML email templates with better styling
- User preference to choose notification channels
- PWA with service worker for offline notifications
