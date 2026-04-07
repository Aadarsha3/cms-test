import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { CalendarEvent } from "./CalendarTypes";
import { useCalendar as useCalendarEvents } from "./hooks/useCalendar";
import { CalendarUI } from "./CalendarUI";

/**
 * CalendarPage (Logic Layer)
 * 
 * This component acts as the 'Container' or 'Controller' for the Academic Calendar.
 * It handles state management, data fetching, and performance-heavy business logic,
 * then delegates rendering to the CalendarView 'Presenter' component.
 */
export function CalendarLogic() {
    const { user } = useAuth();

    // -- State Management --
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [viewingMonth, setViewingMonth] = useState<Date>(new Date());
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(null);
    const [eventToDelete, setEventToDelete] = useState<string | null>(null);

    // -- Data Fetching --
    const {
        events,
        isLoading,
        addEvent,
        updateEvent,
        deleteEvent,
        isProcessing
    } = useCalendarEvents(viewingMonth.getFullYear(), viewingMonth.getMonth() + 1);

    // Synchronize month view when a date is selected from outside (e.g. Upcoming Events list)
    useEffect(() => {
        if (selectedDate) setViewingMonth(selectedDate);
    }, [selectedDate]);

    const isAdmin = user?.role === "admin";

    // -- Event Handlers (Logic) --

    /**
     * Handles creating a new event or updating an existing one
     */
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

    /**
     * Opens the event dialog in 'edit' mode with prefilled data
     */
    const handleEditInitiated = (event: CalendarEvent) => {
        setActiveEvent(event);
        setIsFormOpen(true);
    };

    /**
     * Prepares for deletion by opening the confirmation alert
     */
    const handleDeleteInitiated = (id: string) => {
        setEventToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    /**
     * Executes the actual deletion through the data hook
     */
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
            isAdmin={isAdmin}
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
