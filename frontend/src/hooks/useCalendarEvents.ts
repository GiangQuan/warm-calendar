import { useState, useCallback, useEffect } from 'react';
import { CalendarEvent } from '@/types/calendar';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import {
  isSameDay,
  getDate,
  getDay,
  startOfDay,
  format,
} from 'date-fns';

export function useCalendarEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // 1. Fetch events from API on mount/user change
  useEffect(() => {
    const fetchEvents = async () => {
      if (user?.id) {
        try {
          const data = await api.getEvents(user.id);
          // Backend trả về mảng EventDto[], cần đảm bảo format date là Date object và ID là string
          const formattedEvents: CalendarEvent[] = data.map((e: any) => ({
            ...e,
            id: String(e.id),
            date: new Date(e.date),
            endDate: e.endDate ? new Date(e.endDate) : undefined,
            color: e.color as any,
            recurrence: e.recurrence as any,
          }));
          setEvents(formattedEvents);
        } catch (error) {
          console.error("Failed to fetch events:", error);
        }
      }
    };
    fetchEvents();
  }, [user]);

  const addEvent = useCallback(
    async (eventData: Omit<CalendarEvent, 'id'>) => {
      if (!user?.id) return;
      try {
        // Prepare data for backend (convert Date to YYYY-MM-DD string)
        const payload = {
          ...eventData,
          userId: user.id,
          date: format(eventData.date, 'yyyy-MM-dd'),
          endDate: eventData.endDate ? format(eventData.endDate, 'yyyy-MM-dd') : undefined,
        };
        const savedEvent = await api.createEvent(payload);
        
        // Update local state with the event returned from backend (stringify ID)
        const formattedSavedEvent: CalendarEvent = {
          ...savedEvent,
          id: String(savedEvent.id),
          date: new Date(savedEvent.date),
          endDate: savedEvent.endDate ? new Date(savedEvent.endDate) : undefined,
          color: savedEvent.color as any,
          recurrence: savedEvent.recurrence as any,
        } as CalendarEvent;
        
        setEvents((prev) => [...prev, formattedSavedEvent]);
      } catch (error) {
        console.error("Failed to add event:", error);
      }
    },
    [user]
  );

  const updateEvent = useCallback(
    async (id: string, updates: Partial<Omit<CalendarEvent, 'id'>>) => {
      try {
        const payload = {
          ...updates,
          userId: user?.id,
          date: updates.date ? format(updates.date, 'yyyy-MM-dd') : undefined,
          endDate: updates.endDate ? format(updates.endDate, 'yyyy-MM-dd') : undefined,
        };
        const updatedEvent = await api.updateEvent(Number(id), payload);
        
        const formattedUpdatedEvent: CalendarEvent = {
          ...updatedEvent,
          id: String(updatedEvent.id),
          date: new Date(updatedEvent.date),
          endDate: updatedEvent.endDate ? new Date(updatedEvent.endDate) : undefined,
          color: updatedEvent.color as any,
          recurrence: updatedEvent.recurrence as any,
        } as CalendarEvent;

        setEvents((prev) =>
          prev.map((event) =>
            event.id === id ? formattedUpdatedEvent : event
          )
        );
      } catch (error) {
        console.error("Failed to update event:", error);
      }
    },
    [user]
  );

  const removeEvent = useCallback(async (id: string) => {
    try {
      await api.deleteEvent(Number(id));
      setEvents((prev) => prev.filter((event) => event.id !== id));
    } catch (error) {
      console.error("Failed to remove event:", error);
    }
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

