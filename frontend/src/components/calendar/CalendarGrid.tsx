import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  isSameDay,
} from 'date-fns';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CalendarEvent } from '@/types/calendar';
import { DraggableEvent } from './DraggableEvent';
import { DroppableCell } from './DroppableCell';

interface CalendarGridProps {
  currentDate: Date;
  selectedDate: Date;
  events: CalendarEvent[];
  onSelectDate: (date: Date) => void;
  onAddEventClick: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarGrid({
  currentDate,
  selectedDate,
  events,
  onSelectDate,
  onAddEventClick,
  onEventClick,
}: CalendarGridProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(event.date, day));
  };

  return (
    <div className="bg-card border border-border overflow-hidden shadow-sm animate-fade-in">
      <div className="grid grid-cols-7" style={{ backgroundColor: '#dae0e7' }}>
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="py-2 sm:py-3 text-center text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border"
          >
            <span className="sm:hidden">{day.charAt(0)}</span>
            <span className="hidden sm:inline">{day}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isDayToday = isToday(day);

          return (
            <DroppableCell
              key={day.toISOString()}
              id={`month-${day.toISOString()}`}
              onClick={() => onSelectDate(day)}
              className={cn(
                'group relative min-h-[80px] sm:min-h-[110px] md:min-h-[120px] lg:min-h-[130px] p-1 sm:p-2 text-left border-b border-r border-gray-200 transition-all duration-200 cursor-pointer',
                index % 7 === 0 && 'border-l-0',
                !isCurrentMonth && 'bg-[#F7F8F9] text-muted-foreground',
                isCurrentMonth && 'hover:bg-accent/40',
                isSelected && 'bg-accent ring-1 ring-inset ring-primary/20'
              )}
            >
              <div className="flex items-start   justify-between">
                <span
                  className={cn(
                    'inline-flex h-5 w-5 sm:h-7 sm:w-7 items-center justify-center text-xs sm:text-sm font-medium transition-all',
                    isDayToday && 'bg-primary text-primary-foreground shadow-sm',
                    !isCurrentMonth && 'text-muted-foreground/60'
                  )}
                >
                  {format(day, 'd')}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddEventClick(day);
                  }}
                  className="hidden sm:flex opacity-0 group-hover:opacity-100 transition-all duration-200 h-6 w-6 items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow"
                  aria-label="Add event"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="mt-0.5 sm:mt-1.5 space-y-0.5 sm:space-y-1">
                {dayEvents.slice(0, window.innerWidth < 640 ? 1 : 2).map((event) => (
                  <DraggableEvent
                    key={event.id}
                    event={event}
                    compact
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick?.(event);
                    }}
                  />
                ))}
                {dayEvents.length > (window.innerWidth < 640 ? 1 : 2) && (
                  <div className="text-[10px] sm:text-xs font-medium text-muted-foreground px-0.5 sm:px-1 hover:text-foreground transition-colors cursor-pointer">
                    +{dayEvents.length - (window.innerWidth < 640 ? 1 : 2)}
                  </div>
                )}
              </div>
            </DroppableCell>
          );
        })}
      </div>
    </div>
  );
}
