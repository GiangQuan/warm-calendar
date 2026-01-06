import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { CalendarEvent, eventColors } from '@/types/calendar';

interface DraggableEventProps {
  event: CalendarEvent;
  showTime?: boolean;
  compact?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export function DraggableEvent({ event, showTime, compact, onClick }: DraggableEventProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: event.id,
    data: { event },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={cn(
        'text-xs text-primary-foreground mb-0.5 cursor-grab active:cursor-grabbing transition-all',
        compact ? 'px-0.5 py-0 text-[10px] sm:text-xs sm:px-1 sm:py-0.5 truncate whitespace-nowrap overflow-hidden' : 'px-1 py-0.5 break-words overflow-hidden',
        eventColors[event.color],
        isDragging && 'opacity-50 shadow-lg z-50'
      )}
    >
      {showTime && event.time && (
        <span className="font-medium">{event.time} </span>
      )}
      {event.title}
    </div>
  );
}
