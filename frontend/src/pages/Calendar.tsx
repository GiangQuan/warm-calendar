import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addMonths, subMonths, addWeeks, subWeeks, parseISO } from 'date-fns';
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay } from '@dnd-kit/core';
import { Plus, MessageCircle, X } from 'lucide-react';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { WeekGrid } from '@/components/calendar/WeekGrid';
import { EventList } from '@/components/calendar/EventList';
import { AddEventForm } from '@/components/calendar/AddEventForm';
import { EditEventForm } from '@/components/calendar/EditEventForm';
import { RecurringEventDialog } from '@/components/calendar/RecurringEventDialog';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { useNotifications } from '@/hooks/useNotifications';
import { CalendarEvent, eventColors } from '@/types/calendar';
import { ViewToggle, CalendarView } from '@/components/calendar/ViewToggle';
import { GeminiChat } from '@/components/calendar/GeminiChat';
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
  const [mobileAIOpen, setMobileAIOpen] = useState(false);
  const { events, addEvent, updateEvent, removeEvent, getEventsForDate } = useCalendarEvents();
  
  // Enable browser notifications
  useNotifications(events);

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
      <div className="min-h-screen bg-background pb-24 lg:pb-0">
        <div className="py-2 px-2 sm:px-4 lg:px-6">
          {/* Header with grid alignment */}
          <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-4 xl:gap-6 mb-3 sm:mb-4">
            <div className="flex items-center justify-between">
              <CalendarHeader
                currentDate={currentDate}
                view={view}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onToday={handleToday}
                onDateChange={setCurrentDate}
              />
              <div className="flex items-center gap-3">
                <ViewToggle view={view} onViewChange={setView} />
                <div className="lg:hidden">
                  <UserProfileDropdown />
                </div>
              </div>
            </div>
            <div className="hidden lg:flex justify-end items-center pt-1">
              <UserProfileDropdown />
            </div>
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
            <div className="hidden lg:flex flex-col gap-4 mb-0">
              <AddEventForm
                selectedDate={selectedDate}
                onAddEvent={addEvent}
                open={addEventOpen}
                onOpenChange={setAddEventOpen}
              />
              <div className="flex-1 flex flex-col gap-4 min-h-0">
                <EventList
                  date={selectedDate}
                  events={selectedDateEvents}
                  onRemoveEvent={removeEvent}
                  onEditEvent={handleEditEvent}
                  className="flex-1 min-h-0"
                />
                
                {/* AI Assistant Section */}
                <GeminiChat />
              </div>
            </div>

            {/* Mobile: Event list below calendar */}
            <div className="lg:hidden mt-3">
              <EventList
                date={selectedDate}
                events={selectedDateEvents}
                onRemoveEvent={removeEvent}
                onEditEvent={handleEditEvent}
                className="max-h-[250px]"
              />
            </div>
          </div>

          {/* Mobile: Expandable AI Chat Panel */}
          <div className={cn(
            "lg:hidden fixed inset-x-0 bottom-0 z-40 transition-all duration-300 ease-in-out",
            mobileAIOpen ? "translate-y-0" : "translate-y-full"
          )}>
            <div className="bg-background border-t border-border shadow-2xl">
              <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
                <div className="flex items-center gap-2">
                  <img src="/gemini-logo.png" alt="Gemini" className="h-5 w-5" />
                  <span className="text-sm font-medium">Gemini AI</span>
                  <span className="text-[9px] px-1.5 py-0.5 bg-primary/10 text-primary rounded-full">⚡ 3.0 Flash</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setMobileAIOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="h-[50vh] max-h-[400px]">
                <GeminiChat />
              </div>
            </div>
          </div>

          {/* Mobile floating buttons */}
          <div className="lg:hidden fixed bottom-4 right-4 flex flex-col gap-3 z-50">
            {/* AI Chat Button */}
            <Button
              onClick={() => setMobileAIOpen(!mobileAIOpen)}
              className={cn(
                "h-12 w-12 rounded-full shadow-lg transition-all",
                mobileAIOpen ? "bg-muted text-muted-foreground" : "bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              )}
              size="icon"
            >
              {mobileAIOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <MessageCircle className="h-5 w-5" />
              )}
            </Button>
            
            {/* Add Event Button */}
            <Button
              onClick={() => setAddEventOpen(true)}
              className="h-14 w-14 rounded-full shadow-lg"
              size="icon"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>
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
