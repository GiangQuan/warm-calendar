import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addMonths, subMonths, addWeeks, subWeeks, parseISO } from 'date-fns';
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay } from '@dnd-kit/core';
import { Plus } from 'lucide-react';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { WeekGrid } from '@/components/calendar/WeekGrid';
import { EventList } from '@/components/calendar/EventList';
import { AddEventForm } from '@/components/calendar/AddEventForm';
import { EditEventForm } from '@/components/calendar/EditEventForm';
import { RecurringEventDialog } from '@/components/calendar/RecurringEventDialog';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { CalendarEvent, eventColors } from '@/types/calendar';
import { CalendarView } from '@/components/calendar/ViewToggle';
import { Button } from '@/components/ui/button';
import { UserProfileDropdown } from '@/components/UserProfileDropdown';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const Calendar = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [editEventOpen, setEditEventOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<CalendarEvent | null>(null);
  const [view, setView] = useState<CalendarView>('month');
  const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(null);
  const [recurringDialogOpen, setRecurringDialogOpen] = useState(false);
  const [pendingDragEvent, setPendingDragEvent] = useState<CalendarEvent | null>(null);
  const [pendingDragDate, setPendingDragDate] = useState<Date | null>(null);
  const [pendingDragTime, setPendingDragTime] = useState<string | undefined>(undefined);
  const { events, addEvent, updateEvent, removeEvent, getEventsForDate } = useCalendarEvents();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handlePrevious = () => {
    if (view === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(subWeeks(currentDate, 1));
    }
  };

  const handleNext = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(addWeeks(currentDate, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const handleAddEventClick = (date: Date) => {
    setSelectedDate(date);
    setAddEventOpen(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEventToEdit(event);
    setEditEventOpen(true);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const draggedEvent = event.active.data.current?.event as CalendarEvent;
    setActiveEvent(draggedEvent || null);
  };

  // Helper to parse drop target and get date/time
  const parseDropTarget = (dropId: string): { newDate: Date; newTime?: string } | null => {
    if (dropId.startsWith('month-')) {
      const dateStr = dropId.replace('month-', '');
      return { newDate: parseISO(dateStr) };
    } else if (dropId.startsWith('allday-')) {
      const dateStr = dropId.replace('allday-', '');
      return { newDate: parseISO(dateStr), newTime: undefined };
    } else {
      const lastDashIndex = dropId.lastIndexOf('-');
      const dateStr = dropId.substring(0, lastDashIndex);
      const hour = parseInt(dropId.substring(lastDashIndex + 1), 10);
      const newTime = `${hour.toString().padStart(2, '0')}:00`;
      return { newDate: parseISO(dateStr), newTime };
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveEvent(null);

    if (!over) return;

    const draggedEvent = active.data.current?.event as CalendarEvent;
    if (!draggedEvent) return;

    const dropId = over.id as string;
    const parsed = parseDropTarget(dropId);
    if (!parsed) return;

    // Check if this is a recurring event
    if (draggedEvent.recurrence !== 'none') {
      // Store pending drag data and show dialog
      setPendingDragEvent(draggedEvent);
      setPendingDragDate(parsed.newDate);
      setPendingDragTime(parsed.newTime);
      setRecurringDialogOpen(true);
    } else {
      // Non-recurring: just move it
      updateEvent(draggedEvent.id, { 
        date: parsed.newDate, 
        ...(parsed.newTime !== undefined && { time: parsed.newTime })
      });
    }
  };

  const handleMoveAllRecurring = () => {
    if (pendingDragEvent && pendingDragDate) {
      updateEvent(pendingDragEvent.id, {
        date: pendingDragDate,
        ...(pendingDragTime !== undefined && { time: pendingDragTime })
      });
    }
    closeRecurringDialog();
  };

  const handleMoveOneRecurring = () => {
    if (pendingDragEvent && pendingDragDate) {
      // Create a new non-recurring event for this instance
      addEvent({
        title: pendingDragEvent.title,
        date: pendingDragDate,
        time: pendingDragTime ?? pendingDragEvent.time,
        color: pendingDragEvent.color,
        recurrence: 'none',
        meetingLink: pendingDragEvent.meetingLink,
      });
    }
    closeRecurringDialog();
  };

  const closeRecurringDialog = () => {
    setRecurringDialogOpen(false);
    setPendingDragEvent(null);
    setPendingDragDate(null);
    setPendingDragTime(undefined);
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-background">
        <div className="py-2 sm:py-3 px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between mb-2">
            <CalendarHeader
              currentDate={currentDate}
              view={view}
              onViewChange={setView}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onToday={handleToday}
            />
            <UserProfileDropdown />
          </div>


          {/* Calendar layout */}
          <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-4 xl:gap-6">
            {view === 'month' ? (
              <CalendarGrid
                currentDate={currentDate}
                selectedDate={selectedDate}
                events={events}
                onSelectDate={setSelectedDate}
                onAddEventClick={handleAddEventClick}
                onEventClick={handleEditEvent}
              />
            ) : (
              <WeekGrid
                currentDate={currentDate}
                selectedDate={selectedDate}
                events={events}
                onSelectDate={setSelectedDate}
                onAddEventClick={handleAddEventClick}
                onEventClick={handleEditEvent}
              />
            )}

            {/* Desktop sidebar */}
            <div className="hidden lg:flex flex-col gap-3 lg:sticky lg:top-2 lg:max-h-[calc(100vh-80px)]">
              <AddEventForm
                selectedDate={selectedDate}
                onAddEvent={addEvent}
                open={addEventOpen}
                onOpenChange={setAddEventOpen}
              />
              <EventList
                date={selectedDate}
                events={selectedDateEvents}
                onRemoveEvent={removeEvent}
                onEditEvent={handleEditEvent}
                className="flex-1 min-h-0"
              />
            </div>

            {/* Mobile: Event list below calendar */}
            <div className="lg:hidden mt-4">
              <EventList
                date={selectedDate}
                events={selectedDateEvents}
                onRemoveEvent={removeEvent}
                onEditEvent={handleEditEvent}
                className="max-h-[300px]"
              />
            </div>
          </div>

          {/* Mobile floating add button */}
          <Button
            onClick={() => setAddEventOpen(true)}
            className="lg:hidden fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
            size="icon"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
        <EditEventForm
          event={eventToEdit}
          open={editEventOpen}
          onOpenChange={setEditEventOpen}
          onUpdateEvent={updateEvent}
          onDeleteEvent={removeEvent}
        />

        {/* Mobile: Add event form */}
        <AddEventForm
          selectedDate={selectedDate}
          onAddEvent={addEvent}
          open={addEventOpen}
          onOpenChange={setAddEventOpen}
        />
      </div>
      <DragOverlay>
        {activeEvent && (
          <div
            className={cn(
              'px-2 py-1 text-xs text-primary-foreground shadow-lg cursor-grabbing opacity-90',
              eventColors[activeEvent.color]
            )}
          >
            {activeEvent.time && (
              <span className="font-medium">{activeEvent.time} </span>
            )}
            {activeEvent.title}
          </div>
        )}
      </DragOverlay>
      
      <RecurringEventDialog
        open={recurringDialogOpen}
        event={pendingDragEvent}
        targetDate={pendingDragDate}
        onClose={closeRecurringDialog}
        onMoveAll={handleMoveAllRecurring}
        onMoveOne={handleMoveOneRecurring}
      />
    </DndContext>
  );
};

export default Calendar;
