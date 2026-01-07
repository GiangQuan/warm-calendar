import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CalendarEvent } from '@/types/calendar';
import { format } from 'date-fns';

interface RecurringEventDialogProps {
  open: boolean;
  event: CalendarEvent | null;
  targetDate: Date | null;
  onClose: () => void;
  onMoveAll: () => void;
  onMoveOne: () => void;
}

export function RecurringEventDialog({
  open,
  event,
  targetDate,
  onClose,
  onMoveAll,
  onMoveOne,
}: RecurringEventDialogProps) {
  if (!event || !targetDate) return null;

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Di chuyển sự kiện lặp lại</AlertDialogTitle>
          <AlertDialogDescription>
            <strong>{event.title}</strong> là sự kiện lặp lại. Bạn muốn di chuyển như thế nào?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 space-y-2 text-sm text-muted-foreground">
          <p>📅 Di chuyển đến: <strong>{format(targetDate, 'dd/MM/yyyy')}</strong></p>
        </div>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel onClick={onClose}>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={onMoveOne} className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
            Chỉ lần này
          </AlertDialogAction>
          <AlertDialogAction onClick={onMoveAll}>
            Toàn bộ chuỗi
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

