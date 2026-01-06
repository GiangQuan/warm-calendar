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

export type EventColor = 'primary' | 'secondary' | 'accent' | 'destructive';

export const eventColors: Record<EventColor, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  accent: 'bg-muted',
  destructive: 'bg-destructive',
};

export const recurrenceLabels: Record<RecurrenceType, string> = {
  none: 'Does not repeat',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};
