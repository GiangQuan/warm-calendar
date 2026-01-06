export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time?: string;
  color: EventColor;
  recurrence: RecurrenceType;
  endDate?: Date;
  meetingLink?: string;
}

export type EventColor = 'primary' | 'secondary' | 'accent' | 'destructive' | 'red' | 'orange' | 'amber' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink' | 'teal';

export const eventColors: Record<EventColor, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  accent: 'bg-muted',
  destructive: 'bg-destructive',
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  amber: 'bg-amber-500',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  indigo: 'bg-indigo-500',
  purple: 'bg-purple-500',
  pink: 'bg-pink-500',
  teal: 'bg-teal-500',
};

export const recurrenceLabels: Record<RecurrenceType, string> = {
  none: 'Does not repeat',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};
