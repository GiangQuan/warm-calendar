import { useState, useEffect } from 'react';
import { Repeat, CalendarIcon, Link, Bell, BellOff } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { CalendarEvent, EventColor, RecurrenceType, recurrenceLabels } from '@/types/calendar';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

interface EditEventFormProps {
  event: CalendarEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateEvent: (id: string, updates: Partial<Omit<CalendarEvent, 'id'>>) => void;
  onDeleteEvent: (id: string) => void;
}

const colorOptions: { value: EventColor; label: string; className: string }[] = [
  { value: 'primary', label: 'Theme Primary', className: 'bg-primary' },
  { value: 'red', label: 'Red', className: 'bg-red-500' },
  { value: 'orange', label: 'Orange', className: 'bg-orange-500' },
  { value: 'amber', label: 'Amber', className: 'bg-amber-500' },
  { value: 'green', label: 'Green', className: 'bg-green-500' },
  { value: 'teal', label: 'Teal', className: 'bg-teal-500' },
  { value: 'blue', label: 'Blue', className: 'bg-blue-500' },
  { value: 'indigo', label: 'Indigo', className: 'bg-indigo-500' },
  { value: 'purple', label: 'Purple', className: 'bg-purple-500' },
  { value: 'pink', label: 'Pink', className: 'bg-pink-500' },
  { value: 'secondary', label: 'Theme Secondary', className: 'bg-secondary' },
];

const recurrenceOptions: RecurrenceType[] = ['none', 'daily', 'weekly', 'monthly'];

export function EditEventForm({
  event,
  open,
  onOpenChange,
  onUpdateEvent,
  onDeleteEvent,
}: EditEventFormProps) {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [color, setColor] = useState<EventColor>('primary');
  const [recurrence, setRecurrence] = useState<RecurrenceType>('none');
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [meetingLink, setMeetingLink] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderMinutes, setReminderMinutes] = useState(15);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setTime(event.time || '');
      setColor(event.color);
      setRecurrence(event.recurrence);
      setEndDate(event.endDate ? new Date(event.endDate) : undefined);
      setStartDate(new Date(event.date));
      setMeetingLink(event.meetingLink || '');
      setReminderEnabled(event.reminderEnabled ?? true);
      setReminderMinutes(event.reminderMinutes ?? 15);
    }
  }, [event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!event || !title.trim()) return;

    onUpdateEvent(event.id, {
      title: title.trim(),
      date: startDate,
      time: time || undefined,
      color,
      recurrence,
      endDate: recurrence !== 'none' ? endDate : undefined,
      meetingLink: meetingLink.trim() || undefined,
      reminderEnabled,
      reminderMinutes,
    });

    onOpenChange(false);
  };

  const handleDelete = () => {
    if (!event) return;
    onDeleteEvent(event.id);
    onOpenChange(false);
  };

  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-serif">Edit Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(startDate, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && setStartDate(date)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-time">Time (optional)</Label>
            <Input
              id="edit-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-meetingLink">Meeting Link (optional)</Label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="edit-meetingLink"
                type="url"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="https://zoom.us/j/..."
                className="pl-9"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setColor(option.value)}
                  className={cn(
                    'h-8 w-8 transition-all',
                    option.className,
                    color === option.value
                      ? 'ring-2 ring-ring ring-offset-2 ring-offset-background'
                      : 'opacity-60 hover:opacity-100'
                  )}
                  aria-label={option.label}
                />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Repeat</Label>
            <Select value={recurrence} onValueChange={(value: RecurrenceType) => setRecurrence(value)}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Repeat className="h-4 w-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {recurrenceOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {recurrenceLabels[option]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {recurrence !== 'none' && (
            <div className="space-y-2">
              <Label>End Date (optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !endDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP') : 'Repeats forever'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => date < startDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                  {endDate && (
                    <div className="p-2 border-t border-border">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        onClick={() => setEndDate(undefined)}
                      >
                        Clear end date
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Reminder Settings */}
          <div className="space-y-3 pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {reminderEnabled ? (
                  <Bell className="h-4 w-4 text-primary" />
                ) : (
                  <BellOff className="h-4 w-4 text-muted-foreground" />
                )}
                <Label htmlFor="edit-reminder-toggle">Reminder</Label>
              </div>
              <Switch
                id="edit-reminder-toggle"
                checked={reminderEnabled}
                onCheckedChange={setReminderEnabled}
              />
            </div>
            
            {reminderEnabled && (
              <Select
                value={reminderMinutes.toString()}
                onValueChange={(val) => setReminderMinutes(parseInt(val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Remind me before..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes before</SelectItem>
                  <SelectItem value="10">10 minutes before</SelectItem>
                  <SelectItem value="15">15 minutes before</SelectItem>
                  <SelectItem value="30">30 minutes before</SelectItem>
                  <SelectItem value="60">1 hour before</SelectItem>
                  <SelectItem value="1440">1 day before</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Save Changes
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
