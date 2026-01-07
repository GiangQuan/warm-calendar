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
        'text-xs text-primary-foreground mb-0.5 cursor-grab active:cursor-grabbing transition-all truncate whitespace-nowrap overflow-hidden min-w-0',
        compact ? 'px-1 py-0.5 text-[11px] sm:text-xs sm:px-1.5 sm:py-0.5' : 'px-1.5 py-0.5',
        eventColors[event.color] || 'bg-blue-500',
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
