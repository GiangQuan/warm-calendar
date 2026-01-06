import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { ViewToggle, CalendarView } from './ViewToggle';

interface CalendarHeaderProps {
  currentDate: Date;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function CalendarHeader({
  currentDate,
  view,
  onViewChange,
  onPrevious,
  onNext,
  onToday,
}: CalendarHeaderProps) {
  const getTitle = () => {
    if (view === 'month') {
      return format(currentDate, 'MMMM yyyy');
    }
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(currentDate);
    if (weekStart.getMonth() === weekEnd.getMonth()) {
      return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'd, yyyy')}`;
    }
    return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
  };

  return (
    <div className="flex flex-col gap-3 mb-4 sm:mb-8 animate-fade-in">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="flex items-center bg-card border border-border p-0.5 sm:p-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onPrevious}
              className="h-7 w-7 sm:h-8 sm:w-8 transition-all hover:bg-accent"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onNext}
              className="h-7 w-7 sm:h-8 sm:w-8 transition-all hover:bg-accent"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h1 className="text-lg sm:text-2xl md:text-3xl font-semibold tracking-tight font-serif truncate">
            {getTitle()}
          </h1>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onToday}
            className="h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm transition-all hover:shadow-sm"
          >
            Today
          </Button>
          <ViewToggle view={view} onViewChange={onViewChange} />
        </div>
      </div>
    </div>
  );
}
