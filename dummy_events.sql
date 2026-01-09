-- Insert realistic dummy events for user_id = 4 (or change to match your user)
INSERT INTO events (title, date, time, color, recurrence, end_date, meeting_link, user_id, created_at, updated_at, reminder_minutes, reminder_enabled) VALUES

-- Today and upcoming week
('Standup Meeting', '2026-01-09', '09:00', 'blue', 'daily', '2026-01-31', 'https://meet.google.com/abc-defg-hij', 4, NOW(), NOW(), 10, 1),
('Code Review - Sprint 5', '2026-01-09', '14:00', 'purple', 'none', NULL, 'https://meet.google.com/xyz-1234', 4, NOW(), NOW(), 15, 1),
('Gym Session', '2026-01-09', '18:00', 'green', 'weekly', '2026-02-28', NULL, 4, NOW(), NOW(), 30, 1),

-- Tomorrow
('Client Demo - Project Alpha', '2026-01-10', '10:00', 'red', 'none', NULL, 'https://zoom.us/j/123456789', 4, NOW(), NOW(), 30, 1),
('Lunch with Team', '2026-01-10', '12:00', 'orange', 'none', NULL, NULL, 4, NOW(), NOW(), 15, 1),
('1-on-1 with Manager', '2026-01-10', '16:00', 'indigo', 'weekly', '2026-03-31', 'https://teams.microsoft.com/l/meetup123', 4, NOW(), NOW(), 10, 1),

-- Weekend
('Farmers Market', '2026-01-11', '08:00', 'green', 'weekly', NULL, NULL, 4, NOW(), NOW(), 60, 1),
('Birthday Party - Minh', '2026-01-11', '19:00', 'pink', 'none', NULL, NULL, 4, NOW(), NOW(), 120, 1),
('Sunday Brunch', '2026-01-12', '10:30', 'amber', 'none', NULL, NULL, 4, NOW(), NOW(), 30, 1),

-- Next week
('Sprint Planning', '2026-01-13', '09:30', 'blue', 'none', NULL, 'https://meet.google.com/sprint-plan', 4, NOW(), NOW(), 15, 1),
('Dentist Appointment', '2026-01-13', '14:00', 'red', 'none', NULL, NULL, 4, NOW(), NOW(), 60, 1),
('Learn Vietnamese - Duolingo', '2026-01-13', '20:00', 'teal', 'daily', '2026-06-30', NULL, 4, NOW(), NOW(), 5, 1),

('Team Retrospective', '2026-01-14', '11:00', 'purple', 'none', NULL, 'https://miro.com/app/board/retro123', 4, NOW(), NOW(), 15, 1),
('Yoga Class', '2026-01-14', '07:00', 'green', 'weekly', '2026-04-30', NULL, 4, NOW(), NOW(), 30, 1),

('Product Review Meeting', '2026-01-15', '15:00', 'blue', 'none', NULL, 'https://meet.google.com/product-review', 4, NOW(), NOW(), 15, 1),
('Date Night', '2026-01-15', '19:30', 'pink', 'none', NULL, NULL, 4, NOW(), NOW(), 60, 1),

('Interview - Senior Developer', '2026-01-16', '10:00', 'indigo', 'none', NULL, 'https://zoom.us/j/interview123', 4, NOW(), NOW(), 30, 1),
('Coffee with Alumni', '2026-01-16', '15:00', 'orange', 'none', NULL, NULL, 4, NOW(), NOW(), 15, 1),

('Release Day - v2.0', '2026-01-17', '09:00', 'red', 'none', NULL, NULL, 4, NOW(), NOW(), 60, 1),
('Celebrate Release Party', '2026-01-17', '18:00', 'amber', 'none', NULL, NULL, 4, NOW(), NOW(), 30, 1),

-- Later in January
('Doctor Checkup', '2026-01-20', '09:30', 'red', 'none', NULL, NULL, 4, NOW(), NOW(), 120, 1),
('Workshop: AI in Development', '2026-01-21', '13:00', 'purple', 'none', NULL, 'https://youtube.com/live/ai-workshop', 4, NOW(), NOW(), 30, 1),
('Pay Bills', '2026-01-25', NULL, 'orange', 'monthly', NULL, NULL, 4, NOW(), NOW(), 1440, 1),
('Mom Birthday', '2026-01-28', NULL, 'pink', 'none', NULL, NULL, 4, NOW(), NOW(), 1440, 1),
('Tet Holiday Prep', '2026-01-29', '10:00', 'red', 'none', NULL, NULL, 4, NOW(), NOW(), 60, 1);
