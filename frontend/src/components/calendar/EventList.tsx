import { format } from 'date-fns';
import { Clock, Trash2, Repeat, CalendarDays, ExternalLink } from 'lucide-react';
import { CalendarEvent, eventColors, recurrenceLabels } from '@/types/calendar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const getMeetingIcon = (url: string) => {
  if (url.includes('zoom')) return '📹';
  if (url.includes('meet.google')) return '📞';
  if (url.includes('teams')) return '💬';
  return '🔗';
};

interface EventListProps {
  date: Date;
  events: CalendarEvent[];
  onRemoveEvent: (id: string) => void;
  onEditEvent: (event: CalendarEvent) => void;
  className?: string;
}

export function EventList({ date, events, onRemoveEvent, onEditEvent, className }: EventListProps) {
  return (
    <div className={cn("bg-card border border-border shadow-sm animate-slide-up flex flex-col overflow-hidden", className)}>
      <div className="p-5 border-b border-border bg-[#dae0e7]">
        <h2 className="text-lg font-semibold font-serif">
          {format(date, 'EEEE')}
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          {format(date, 'MMMM d, yyyy')}
        </p>
      </div>
      <div className="p-4 flex-1 overflow-y-auto min-h-0">
        {events.length === 0 ? (
          <div className="text-center py-8">
            <CalendarDays className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground text-sm">No events scheduled</p>
            <p className="text-muted-foreground/60 text-xs mt-1">
              Click the + button on a day to add one
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {events.map((event, index) => (
              <div
                key={event.id}
                className="flex items-start gap-3 group cursor-pointer hover:bg-accent/50 p-2.5 transition-all duration-200 border border-transparent hover:border-border"
                onClick={() => onEditEvent(event)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className={cn('w-1 self-stretch min-h-[40px] shrink-0 transition-all group-hover:w-1.5', eventColors[event.color])}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{event.title}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                    {event.time && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {event.time}
                      </div>
                    )}
                    {event.recurrence !== 'none' && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Repeat className="h-3 w-3" />
                        <span>
                          {recurrenceLabels[event.recurrence]}
                          {event.endDate && ` until ${format(new Date(event.endDate), 'MMM d')}`}
                        </span>
                      </div>
                    )}
                    {event.meetingLink && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(event.meetingLink, '_blank', 'noopener,noreferrer');
                        }}
                        className="flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <span>{getMeetingIcon(event.meetingLink)}</span>
                        <span>Join Meeting</span>
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-all duration-200 h-8 w-8 hover:bg-destructive/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveEvent(event.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
