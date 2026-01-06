import { Calendar, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type CalendarView = 'month' | 'week';

interface ViewToggleProps {
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex bg-muted/50 border border-border p-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange('month')}
        className={cn(
          'gap-2 h-8 px-3 transition-all duration-200',
          view === 'month'
            ? 'bg-card shadow-sm text-foreground'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Calendar className="h-4 w-4" />
        <span className="hidden sm:inline">Month</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange('week')}
        className={cn(
          'gap-2 h-8 px-3 transition-all duration-200',
          view === 'week'
            ? 'bg-card shadow-sm text-foreground'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <CalendarDays className="h-4 w-4" />
        <span className="hidden sm:inline">Week</span>
      </Button>
    </div>
  );
}
