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
import { getHoliday, getLunarDisplay } from '@/utils/vietnamese-calendar';

interface CalendarGridProps {
  currentDate: Date;
  selectedDate: Date;
  events: CalendarEvent[];
  onSelectDate: (date: Date) => void;
  onAddEventClick: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  showLunar?: boolean;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarGrid({
  currentDate,
  selectedDate,
  events,
  onSelectDate,
  onAddEventClick,
  onEventClick,
  showLunar = false,
}: CalendarGridProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      const checkDate = new Date(day);
      
      // Reset time to start of day for comparison
      eventDate.setHours(0, 0, 0, 0);
      checkDate.setHours(0, 0, 0, 0);
      
      // Exact match
      if (isSameDay(eventDate, checkDate)) return true;
      
      // Only check recurrence if the date is after the event start date
      if (checkDate < eventDate) return false;
      
      // Check end date if it exists
      if (event.endDate) {
        const endDate = new Date(event.endDate);
        endDate.setHours(0, 0, 0, 0);
        if (checkDate > endDate) return false;
      }
      
      // Handle recurrence
      switch (event.recurrence) {
        case 'daily':
          return true;
        case 'weekly':
          return eventDate.getDay() === checkDate.getDay();
        case 'monthly':
          return eventDate.getDate() === checkDate.getDate();
        default:
          return false;
      }
    });
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
          const holiday = getHoliday(day);
          const isHoliday = holiday !== null;
          const isPublicHoliday = holiday?.type === 'public';
          const isLunarHoliday = holiday?.type === 'lunar';
          const isObservance = holiday?.type === 'observance';

          return (
            <DroppableCell
              key={day.toISOString()}
              id={`month-${day.toISOString()}`}
              onClick={() => onSelectDate(day)}
              className={cn(
                'group relative min-h-[80px] sm:min-h-[110px] md:min-h-[120px] lg:min-h-[130px] p-1 sm:p-2 text-left border-b border-r border-gray-200 transition-all duration-200 cursor-pointer',
                index % 7 === 0 && 'border-l-0',
                !isCurrentMonth && 'bg-[#F7F8F9] text-muted-foreground',
                // Today
                isDayToday && 'bg-blue-50 ring-2 ring-inset ring-blue-400/50',
                // Holiday backgrounds (when not today)
                !isDayToday && isPublicHoliday && 'bg-red-50 border-red-200',
                !isDayToday && isLunarHoliday && 'bg-amber-50 border-amber-200',
                !isDayToday && isObservance && 'bg-pink-50 border-pink-200',
                // Hover for normal days
                isCurrentMonth && !isDayToday && !isHoliday && 'hover:bg-accent/40',
                // Selected state
                isSelected && !isDayToday && !isHoliday && 'bg-accent ring-1 ring-inset ring-primary/20'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <span
                      className={cn(
                        'inline-flex items-center justify-center text-sm sm:text-base font-medium transition-all rounded-full',
                        isDayToday 
                          ? 'h-8 w-8 sm:h-10 sm:w-10 bg-blue-500 text-white shadow-md font-bold text-base sm:text-lg' 
                          : 'h-6 w-6 sm:h-8 sm:w-8',
                        // Holiday-specific text colors
                        !isDayToday && isPublicHoliday && 'text-red-600 font-semibold',
                        !isDayToday && isLunarHoliday && 'text-amber-600 font-semibold',
                        !isDayToday && isObservance && 'text-pink-600 font-semibold',
                        !isCurrentMonth && 'text-muted-foreground/60'
                      )}
                    >
                      {format(day, 'd')}
                    </span>
                    {/* Lunar date display */}
                    {showLunar && (() => {
                      const lunar = getLunarDisplay(day);
                      return (
                        <span 
                          className={cn(
                            'text-[9px] sm:text-[10px] leading-tight',
                            lunar.isSpecial ? 'text-amber-600 font-semibold' : 'text-muted-foreground'
                          )}
                        >
                          {lunar.text}
                        </span>
                      );
                    })()}
                  </div>
                  {isHoliday && (
                    <span 
                      className={cn(
                        'hidden sm:inline-block text-[11px] md:text-xs font-medium truncate',
                        holiday.type === 'public' && 'text-red-600',
                        holiday.type === 'lunar' && 'text-amber-600',
                        holiday.type === 'observance' && 'text-pink-500'
                      )}
                      title={holiday.name}
                    >
                      {holiday.name}
                    </span>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddEventClick(day);
                  }}
                  className="hidden sm:flex opacity-0 group-hover:opacity-100 transition-all duration-200 h-6 w-6 items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow flex-shrink-0"
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
