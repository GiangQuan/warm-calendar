import { useEffect, useCallback, useRef } from 'react';
import { CalendarEvent } from '@/types/calendar';

// Notification sound - using a pleasant chime from a CDN
const NOTIFICATION_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';

export function useNotifications(events: CalendarEvent[]) {
  const scheduledNotifications = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio(NOTIFICATION_SOUND_URL);
    audioRef.current.volume = 0.5; // 50% volume
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Play notification sound
  const playSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => {
        console.log('Could not play notification sound:', err);
      });
    }
  }, []);

  // Request permission
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }, []);

  // Format time for display
  const formatEventTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Show notification
  const showNotification = useCallback((event: CalendarEvent) => {
    if (Notification.permission !== 'granted') return;

    // Play sound first
    playSound();

    const timeDisplay = event.time ? formatEventTime(event.time) : 'soon';
    
    const notification = new Notification(`🔔 Reminder: ${event.title}`, {
      body: `Starting at ${timeDisplay}\n${event.meetingLink ? '🔗 Click to join meeting' : 'Tap to open calendar'}`,
      icon: '/gemini-logo.png',
      badge: '/gemini-logo.png',
      tag: event.id,
      requireInteraction: true,
      silent: false, // We play our own sound
    });

    notification.onclick = () => {
      window.focus();
      
      // If there's a meeting link, open it
      if (event.meetingLink) {
        window.open(event.meetingLink, '_blank', 'noopener,noreferrer');
      }
      
      notification.close();
    };

    // Auto-close after 30 seconds
    setTimeout(() => {
      notification.close();
    }, 30000);
  }, [playSound]);

  // Schedule notifications for events
  const scheduleNotifications = useCallback(() => {
    // Clear existing scheduled notifications
    scheduledNotifications.current.forEach((timeout) => clearTimeout(timeout));
    scheduledNotifications.current.clear();

    const now = new Date();

    events.forEach((event) => {
      // Skip if reminder is disabled or no time set
      if (!event.reminderEnabled || !event.time) return;

      const eventDate = new Date(event.date);
      const [hours, minutes] = event.time.split(':').map(Number);
      eventDate.setHours(hours, minutes, 0, 0);

      // Calculate notification time
      const reminderMinutes = event.reminderMinutes || 15;
      const notificationTime = new Date(eventDate.getTime() - reminderMinutes * 60 * 1000);

      // Only schedule if notification time is in the future
      const delay = notificationTime.getTime() - now.getTime();
      if (delay > 0 && delay < 24 * 60 * 60 * 1000) { // Within 24 hours
        const timeout = setTimeout(() => {
          showNotification(event);
        }, delay);

        scheduledNotifications.current.set(event.id, timeout);
        
        const minutesUntil = Math.round(delay / 60000);
        console.log(`🔔 Scheduled: "${event.title}" in ${minutesUntil} min (at ${event.time})`);
      }
    });

    if (scheduledNotifications.current.size > 0) {
      console.log(`📅 ${scheduledNotifications.current.size} notification(s) scheduled for today`);
    }
  }, [events, showNotification]);

  // Request permission on mount
  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  // Reschedule when events change
  useEffect(() => {
    scheduleNotifications();

    return () => {
      scheduledNotifications.current.forEach((timeout) => clearTimeout(timeout));
    };
  }, [scheduleNotifications]);

  // Test notification function for debugging
  const testNotification = useCallback(() => {
    if (Notification.permission !== 'granted') {
      requestPermission();
      return;
    }
    
    playSound();
    
    new Notification('🔔 Test Notification', {
      body: 'This is a test notification from Warm Calendar',
      icon: '/gemini-logo.png',
      requireInteraction: true,
    });
  }, [playSound, requestPermission]);

  return {
    requestPermission,
    testNotification,
    isSupported: typeof window !== 'undefined' && 'Notification' in window,
    permission: typeof window !== 'undefined' && 'Notification' in window 
      ? Notification.permission 
      : 'default' as NotificationPermission,
    scheduledCount: scheduledNotifications.current.size,
  };
}
