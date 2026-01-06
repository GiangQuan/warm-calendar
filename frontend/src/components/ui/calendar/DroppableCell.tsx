import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

interface DroppableCellProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function DroppableCell({ id, children, className, onClick }: DroppableCellProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      className={cn(
        className,
        isOver && 'bg-primary/10 ring-2 ring-inset ring-primary/30'
      )}
    >
      {children}
    </div>
  );
}
