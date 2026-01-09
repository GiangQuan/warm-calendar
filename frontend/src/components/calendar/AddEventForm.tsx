import { useState, useEffect } from 'react';
import { Plus, Repeat, CalendarIcon, Link, Bell, BellOff } from 'lucide-react';
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
  DialogTrigger,
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
import { EventColor, RecurrenceType, recurrenceLabels } from '@/types/calendar';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

interface AddEventFormProps {
  selectedDate: Date;
  onAddEvent: (event: { title: string; date: Date; time?: string; color: EventColor; recurrence: RecurrenceType; endDate?: Date; meetingLink?: string; reminderEnabled?: boolean; reminderMinutes?: number }) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
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

export function AddEventForm({ selectedDate, onAddEvent, open: controlledOpen, onOpenChange }: AddEventFormProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [color, setColor] = useState<EventColor>('primary');
  const [recurrence, setRecurrence] = useState<RecurrenceType>('none');
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [meetingLink, setMeetingLink] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderMinutes, setReminderMinutes] = useState(15);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (onOpenChange ?? (() => { })) : setInternalOpen;

  useEffect(() => {
    if (!open) {
      setTitle('');
      setTime('');
      setColor('primary');
      setRecurrence('none');
      setEndDate(undefined);
      setMeetingLink('');
      setReminderEnabled(true);
      setReminderMinutes(15);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddEvent({
      title: title.trim(),
      date: selectedDate,
      time: time || undefined,
      color,
      recurrence,
      endDate: recurrence !== 'none' ? endDate : undefined,
      meetingLink: meetingLink.trim() || undefined,
      reminderEnabled,
      reminderMinutes,
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button className="w-full gap-2 shadow-sm hover:shadow transition-all">
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="animate-scale-in">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            New Event
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Time (optional)</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="meetingLink">Meeting Link (optional)</Label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="meetingLink"
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
                    disabled={(date) => date < selectedDate}
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
                <Label htmlFor="reminder-toggle">Reminder</Label>
              </div>
              <Switch
                id="reminder-toggle"
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

          <Button type="submit" className="w-full">
            Create Event
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
