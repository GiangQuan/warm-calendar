import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  isToday,
  setHours,
} from 'date-fns';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CalendarEvent, eventColors } from '@/types/calendar';
import { DraggableEvent } from './DraggableEvent';
import { DroppableCell } from './DroppableCell';

interface WeekGridProps {
  currentDate: Date;
  selectedDate: Date;
  events: CalendarEvent[];
  onSelectDate: (date: Date) => void;
  onAddEventClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 6 AM to 9 PM

export function WeekGrid({
  currentDate,
  selectedDate,
  events,
  onSelectDate,
  onAddEventClick,
  onEventClick,
}: WeekGridProps) {
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getEventsForDayAndHour = (day: Date, hour: number) => {
    return events.filter((event) => {
      if (!isSameDay(new Date(event.date), day)) {
        // Check if it's a recurring event that shows on this day
        const eventDate = new Date(event.date);
        if (event.recurrence === 'none') return false;
        if (day < eventDate) return false;
        if (event.endDate && day > new Date(event.endDate)) return false;
        
        const matchesDay = (() => {
          switch (event.recurrence) {
            case 'daily': return true;
            case 'weekly': return eventDate.getDay() === day.getDay();
            case 'monthly': return eventDate.getDate() === day.getDate();
            default: return false;
          }
        })();
        
        if (!matchesDay) return false;
      }
      
      if (!event.time) return hour === 9; // Default to 9 AM for events without time
      const eventHour = parseInt(event.time.split(':')[0], 10);
      return eventHour === hour;
    });
  };

  const getAllDayEvents = (day: Date) => {
    return events.filter((event) => {
      const eventMatches = isSameDay(new Date(event.date), day) || (() => {
        const eventDate = new Date(event.date);
        if (event.recurrence === 'none') return false;
        if (day < eventDate) return false;
        if (event.endDate && day > new Date(event.endDate)) return false;
        
        switch (event.recurrence) {
          case 'daily': return true;
          case 'weekly': return eventDate.getDay() === day.getDay();
          case 'monthly': return eventDate.getDate() === day.getDate();
          default: return false;
        }
      })();
      
      return eventMatches && !event.time;
    });
  };

  return (
    <div className="bg-card border border-border overflow-hidden shadow-sm animate-fade-in">
      {/* Header with days */}
      <div className="grid grid-cols-[40px_repeat(7,1fr)] sm:grid-cols-[60px_repeat(7,1fr)] border-b border-border bg-muted/30">
        <div className="py-2 sm:py-3 border-r border-border" />
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className={cn(
              'py-2 sm:py-3 text-center border-r border-border last:border-r-0 transition-colors',
              isSameDay(day, selectedDate) && 'bg-accent/50'
            )}
          >
            <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span className="sm:hidden">{format(day, 'EEEEE')}</span>
              <span className="hidden sm:inline">{format(day, 'EEE')}</span>
            </div>
            <div
              className={cn(
                'text-sm sm:text-lg font-medium mt-0.5 sm:mt-1 mx-auto w-6 h-6 sm:w-9 sm:h-9 flex items-center justify-center transition-all',
                isToday(day) && 'bg-primary text-primary-foreground shadow-sm'
              )}
            >
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>

      {/* All day events row */}
      <div className="grid grid-cols-[40px_repeat(7,1fr)] sm:grid-cols-[60px_repeat(7,1fr)] border-b border-border min-h-[32px] sm:min-h-[40px]">
        <div className="py-1 sm:py-2 px-1 sm:px-2 text-[10px] sm:text-xs text-muted-foreground border-r border-border flex items-center justify-end">
          <span className="sm:hidden">All</span>
          <span className="hidden sm:inline">All day</span>
        </div>
        {days.map((day) => {
          const allDayEvents = getAllDayEvents(day);
          return (
            <DroppableCell
              key={day.toISOString()}
              id={`allday-${day.toISOString()}`}
              onClick={() => onSelectDate(day)}
              className={cn(
                'group relative p-0.5 sm:p-1 border-r border-border last:border-r-0 cursor-pointer hover:bg-accent/50',
                isSameDay(day, selectedDate) && 'bg-accent/30'
              )}
            >
              {allDayEvents.slice(0, 1).map((event) => (
                <DraggableEvent
                  key={event.id}
                  event={event}
                  compact
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventClick(event);
                  }}
                />
              ))}
              {allDayEvents.length > 1 && (
                <div className="text-[10px] sm:text-xs text-muted-foreground">
                  +{allDayEvents.length - 1}
                </div>
              )}
            </DroppableCell>
          );
        })}
      </div>

      {/* Time slots */}
      <div className="overflow-y-auto max-h-[400px] sm:max-h-[600px]">
        {HOURS.map((hour) => (
          <div
            key={hour}
            className="grid grid-cols-[40px_repeat(7,1fr)] sm:grid-cols-[60px_repeat(7,1fr)] border-b border-border last:border-b-0"
          >
            <div className="py-1 sm:py-2 px-1 sm:px-2 text-[10px] sm:text-xs text-muted-foreground border-r border-border text-right">
              {format(setHours(new Date(), hour), 'ha')}
            </div>
            {days.map((day) => {
              const hourEvents = getEventsForDayAndHour(day, hour);
              return (
                <DroppableCell
                  key={`${day.toISOString()}-${hour}`}
                  id={`${day.toISOString()}-${hour}`}
                  onClick={() => onSelectDate(day)}
                  className={cn(
                    'group relative min-h-[36px] sm:min-h-[48px] p-0.5 border-r border-border last:border-r-0 cursor-pointer hover:bg-accent/50',
                    isSameDay(day, selectedDate) && 'bg-accent/30'
                  )}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddEventClick(day);
                    }}
                    className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition-opacity h-4 w-4 sm:h-5 sm:w-5 hidden sm:flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
                    aria-label="Add event"
                  >
                    <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  </button>
                  {hourEvents.slice(0, 1).map((event) => (
                    <DraggableEvent
                      key={event.id}
                      event={event}
                      showTime
                      compact
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                    />
                  ))}
                  {hourEvents.length > 1 && (
                    <div className="text-[10px] text-muted-foreground">
                      +{hourEvents.length - 1}
                    </div>
                  )}
                </DroppableCell>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
