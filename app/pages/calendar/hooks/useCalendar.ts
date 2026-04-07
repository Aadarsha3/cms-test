import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { calendarService } from "../CalendarApi";
import { useToast } from "@/hooks/use-toast";
import { CalendarEvent } from "../CalendarTypes";

/**
 * Custom hook to manage calendar data and operations.
 * Centralizes fetching, adding, updating, and deleting events.
 */
export function useCalendar(year: number, month: number) {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const { data: events = [], isLoading } = useQuery({
        queryKey: ["calendar-events", year, month],
        queryFn: () => calendarService.getEventsByMonth(year, month),
    });

    const refreshData = () => {
        queryClient.invalidateQueries({ queryKey: ["calendar-events"] });
    };

    const addMutation = useMutation({
        mutationFn: calendarService.createEvent,
        onSuccess: () => {
            refreshData();
            toast({
                variant: "default",
                title: "Event Scheduled",
                description: "Your academic calendar has been successfully updated.",
            });
        },
        onError: (err: Error) => {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, details }: { id: string, details: any }) =>
            calendarService.updateEvent(id, details),
        onSuccess: () => {
            refreshData();
            toast({
                variant: "default",
                title: "Changes Saved",
                description: "All modifications were applied successfully.",
            });
        },
        onError: (err: Error) => {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: calendarService.deleteEvent,
        onSuccess: () => {
            refreshData();
            toast({
                variant: "default",
                title: "Successfully Deleted",
                description: "The event has been removed from your schedule.",
            });
        },
        onError: () => {
            toast({ title: "Error", description: "Could not delete event.", variant: "destructive" });
        }
    });

    return {
        events,
        isLoading,
        addEvent: addMutation.mutateAsync,
        updateEvent: updateMutation.mutateAsync,
        deleteEvent: deleteMutation.mutateAsync,
        isProcessing: addMutation.isPending || updateMutation.isPending
    };
}
