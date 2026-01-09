import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, startOfWeek, endOfWeek, setMonth, setYear } from 'date-fns';
import { CalendarView } from './ViewToggle';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

interface CalendarHeaderProps {
  currentDate: Date;
  view: CalendarView;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onDateChange?: (date: Date) => void;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

export function CalendarHeader({
  currentDate,
  view,
  onPrevious,
  onNext,
  onToday,
  onDateChange,
}: CalendarHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

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

  const handleMonthChange = (month: string) => {
    if (onDateChange) {
      const newDate = setMonth(currentDate, parseInt(month));
      onDateChange(newDate);
    }
  };

  const handleYearChange = (year: string) => {
    if (onDateChange) {
      const newDate = setYear(currentDate, parseInt(year));
      onDateChange(newDate);
    }
  };

  return (
    <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-4 animate-fade-in">
      <div className="flex items-center bg-muted/30 rounded-lg p-0.5 sm:p-1 gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrevious}
          className="h-7 w-7 sm:h-9 sm:w-9 rounded-md transition-all duration-200 hover:bg-accent hover:scale-105 active:scale-95"
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onNext}
          className="h-7 w-7 sm:h-9 sm:w-9 rounded-md transition-all duration-200 hover:bg-accent hover:scale-105 active:scale-95"
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="text-base xs:text-lg sm:text-xl md:text-2xl font-semibold tracking-tight font-serif text-foreground hover:bg-accent/50 px-1.5 sm:px-2 py-1 h-auto gap-0.5 sm:gap-1 transition-all duration-200"
          >
            {getTitle()}
            <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4 bg-popover border border-border shadow-lg z-50" align="start">
          <div className="flex gap-3">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Month</label>
              <Select
                value={currentDate.getMonth().toString()}
                onValueChange={handleMonthChange}
              >
                <SelectTrigger className="w-[130px] bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border z-50">
                  {MONTHS.map((month, index) => (
                    <SelectItem key={month} value={index.toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Year</label>
              <Select
                value={currentDate.getFullYear().toString()}
                onValueChange={handleYearChange}
              >
                <SelectTrigger className="w-[100px] bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border z-50 max-h-[200px]">
                  {YEARS.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <div className="flex items-center gap-1 sm:gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onToday}
          className="h-7 sm:h-9 px-2 sm:px-4 text-xs sm:text-sm font-medium rounded-lg border-border/60 bg-card hover:bg-accent hover:border-accent transition-all duration-200 hover:shadow-md active:scale-95"
        >
          Today
        </Button>
      </div>
    </div>
  );
}
