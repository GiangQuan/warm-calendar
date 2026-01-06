import { useState, useCallback } from 'react';
import { CalendarEvent } from '@/types/calendar';
import {
  isSameDay,
  getDate,
  getDay,
  addWeeks,
  startOfDay,
} from 'date-fns';

const generateId = () => Math.random().toString(36).substring(2, 9);

export function useCalendarEvents() {
  const today = new Date();
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: generateId(),
      title: 'Team Meeting',
      date: today,
      time: '10:00',
      color: 'primary',
      recurrence: 'weekly',
      endDate: addWeeks(today, 4),
      meetingLink: 'https://zoom.us/j/123456789',
    },
    {
      id: generateId(),
      title: 'Lunch with Sarah',
      date: today,
      time: '12:30',
      color: 'secondary',
      recurrence: 'none',
    },
    {
      id: generateId(),
      title: 'Project Review',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
      time: '14:00',
      color: 'accent',
      recurrence: 'none',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
    },
    {
      id: generateId(),
      title: 'Client Call',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
      time: '09:30',
      color: 'destructive',
      recurrence: 'none',
      meetingLink: 'https://teams.microsoft.com/meet/123',
    },
    {
      id: generateId(),
      title: 'Gym Session',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
      time: '07:00',
      color: 'primary',
      recurrence: 'daily',
      endDate: addWeeks(today, 2),
    },
    {
      id: generateId(),
      title: 'Birthday Party',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
      time: '18:00',
      color: 'secondary',
      recurrence: 'none',
    },
    {
      id: generateId(),
      title: 'Doctor Appointment',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
      time: '11:00',
      color: 'destructive',
      recurrence: 'none',
    },
    {
      id: generateId(),
      title: 'Weekly Standup',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
      time: '09:00',
      color: 'accent',
      recurrence: 'weekly',
      meetingLink: 'https://zoom.us/j/987654321',
    },
  ]);

  const addEvent = useCallback(
    (event: Omit<CalendarEvent, 'id'>) => {
      setEvents((prev) => [...prev, { ...event, id: generateId() }]);
    },
    []
  );

  const updateEvent = useCallback(
    (id: string, updates: Partial<Omit<CalendarEvent, 'id'>>) => {
      setEvents((prev) =>
        prev.map((event) =>
          event.id === id ? { ...event, ...updates } : event
        )
      );
    },
    []
  );

  const removeEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  }, []);

  const isEventOnDate = (event: CalendarEvent, date: Date): boolean => {
    const eventDate = startOfDay(new Date(event.date));
    const checkDate = startOfDay(date);
    
    // Exact match
    if (isSameDay(eventDate, checkDate)) return true;
    
    // Only check recurrence if the date is after the event start date
    if (checkDate < eventDate) return false;
    
    // Check end date if it exists
    if (event.endDate && checkDate > startOfDay(new Date(event.endDate))) return false;

    switch (event.recurrence) {
      case 'daily':
        return true;
      case 'weekly':
        return getDay(eventDate) === getDay(checkDate);
      case 'monthly':
        return getDate(eventDate) === getDate(checkDate);
      default:
        return false;
    }
  };

  const getEventsForDate = useCallback(
    (date: Date) => {
      return events.filter((event) => isEventOnDate(event, date));
    },
    [events]
  );

  return { events, addEvent, updateEvent, removeEvent, getEventsForDate };
}
