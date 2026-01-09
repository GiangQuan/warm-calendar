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
        'text-xs text-primary-foreground mb-0.5 cursor-grab active:cursor-grabbing transition-all duration-300 ease-out truncate whitespace-nowrap overflow-hidden min-w-0 opacity-80',
        compact ? 'px-1 py-0.5 text-[11px] sm:text-xs sm:px-1.5 sm:py-1' : 'px-2 py-1',
        eventColors[event.color] || 'bg-blue-500',
        isDragging ? 'opacity-30 scale-105 shadow-xl z-50 ring-2 ring-primary/20' : 'hover:opacity-100 hover:scale-[1.02] hover:shadow-md'
      )}
    >
      {showTime && event.time && (
        <span className="font-semibold opacity-90">{event.time} </span>
      )}
      <span className="font-medium">{event.title}</span>
    </div>
  );
}
