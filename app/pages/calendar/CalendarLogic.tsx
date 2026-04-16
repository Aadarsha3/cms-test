import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { CalendarEvent } from "./CalendarTypes";
import { useCalendar as useCalendarEvents } from "@/hooks/useCalendar";
import { CalendarUI } from "./CalendarUI";

export function CalendarLogic() {
  const { user, hasPermission } = useAuth();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [viewingMonth, setViewingMonth] = useState<Date>(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(null);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  // Data Fetching
  const {
    events,
    isLoading,
    addEvent,
    updateEvent,
    deleteEvent,
    isProcessing,
  } = useCalendarEvents(
    viewingMonth.getFullYear(),
    viewingMonth.getMonth() + 1,
  );

  // Synchronize month view when a date is selected from outside (e.g. Upcoming Events list)
  useEffect(() => {
    if (selectedDate) setViewingMonth(selectedDate);
  }, [selectedDate]);

  const canManage = hasPermission("calendar_manage");

  // Event Handlers (Logic)

  const handleFormSubmit = async (formData: Partial<CalendarEvent>) => {
    try {
      if (activeEvent) {
        await updateEvent({ id: activeEvent.id, details: formData });
      } else {
        await addEvent(formData as Omit<CalendarEvent, "id">);
      }
      setIsFormOpen(false);
      setActiveEvent(null);
    } catch (error) {
      console.error("Failed to save event:", error);
    }
  };

  const handleEditInitiated = (event: CalendarEvent) => {
    setActiveEvent(event);
    setIsFormOpen(true);
  };

  const handleDeleteInitiated = (id: string) => {
    setEventToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (eventToDelete) {
      await deleteEvent(eventToDelete);
      setIsDeleteDialogOpen(false);
      setEventToDelete(null);
    }
  };

  // -- Render Presenter --
  return (
    <CalendarUI
      events={events}
      selectedDate={selectedDate}
      viewingMonth={viewingMonth}
      isLoading={isLoading}
      isProcessing={isProcessing}
      isAdmin={canManage}
      isFormOpen={isFormOpen}
      isDeleteDialogOpen={isDeleteDialogOpen}
      activeEvent={activeEvent}
      setSelectedDate={setSelectedDate}
      setViewingMonth={setViewingMonth}
      setIsFormOpen={setIsFormOpen}
      setIsDeleteDialogOpen={setIsDeleteDialogOpen}
      onFormSubmit={handleFormSubmit}
      onEditInitiated={handleEditInitiated}
      onDeleteInitiated={handleDeleteInitiated}
      confirmDelete={confirmDelete}
    />
  );
}

export default CalendarLogic;
