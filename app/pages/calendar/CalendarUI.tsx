import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Loader2, Clock } from "lucide-react";
import { format } from "date-fns";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { CalendarEvent } from "./CalendarTypes";
import { DayCell } from "@/components/calendar/DayCell";
import { Legend as CalendarLegend } from "@/components/calendar/Legend";
import { UpcomingEvents as UpcomingEventsCard } from "./UpcomingEvents";
import { EventDetails as EventDetailsCard } from "./EventDetails";
import { EventDialog as EventFormDialog } from "./EventDialog";

interface CalendarUIProps {
    // Data & State
    events: CalendarEvent[];
    selectedDate: Date | undefined;
    viewingMonth: Date;
    isLoading: boolean;
    isProcessing: boolean;
    isAdmin: boolean;

    // UI control
    isFormOpen: boolean;
    isDeleteDialogOpen: boolean;
    activeEvent: CalendarEvent | null;

    // Setters
    setSelectedDate: (date: Date | undefined) => void;
    setViewingMonth: (date: Date) => void;
    setIsFormOpen: (open: boolean) => void;
    setIsDeleteDialogOpen: (open: boolean) => void;

    // Handlers
    onFormSubmit: (formData: Partial<CalendarEvent>) => Promise<void>;
    onEditInitiated: (event: CalendarEvent) => void;
    onDeleteInitiated: (id: string) => void;
    confirmDelete: () => Promise<void>;
}

export function CalendarUI({
    events,
    selectedDate,
    viewingMonth,
    isLoading,
    isProcessing,
    isAdmin,
    isFormOpen,
    isDeleteDialogOpen,
    activeEvent,
    setSelectedDate,
    setViewingMonth,
    setIsFormOpen,
    setIsDeleteDialogOpen,
    onFormSubmit,
    onEditInitiated,
    onDeleteInitiated,
    confirmDelete
}: CalendarUIProps) {
    // Optimization: Group events by date string (YYYY-MM-DD) for O(1) lookup in DayCell
    const groupedEvents = useMemo(() => {
        const map: Record<string, CalendarEvent[]> = {};
        events.forEach(event => {
            const dateKey = format(event.date, "yyyy-MM-dd");
            if (!map[dateKey]) map[dateKey] = [];
            map[dateKey].push(event);
        });
        return map;
    }, [events]);

    return (
        <MainLayout title="Academic Calendar" className="pt-0 relative overflow-x-hidden">
            <div className="hidden lg:block absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
            <div className="hidden lg:block absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

            <div className="w-full relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-4 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">

                <div className="flex flex-col gap-4">
                    <Card className="flex flex-col border border-primary/5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.1)] bg-card/60 backdrop-blur-xl overflow-hidden ring-1 ring-white/10">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-primary/5 bg-primary/[0.01] py-2 px-3 sm:px-4">
                            <div className="flex items-center gap-2">
                                <div className="">
                                    <CalendarIcon className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-bold tracking-tight">Calendar</CardTitle>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="hidden sm:flex h-8 gap-1.5 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all active:scale-95 text-xs font-semibold"
                                    onClick={() => setSelectedDate(new Date())}
                                >
                                    <Clock className="h-3.5 w-3.5" />
                                    Today: {format(new Date(), "MMM d")}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="sm:hidden h-8 w-8 border-primary/20"
                                    onClick={() => setSelectedDate(new Date())}
                                    title="Go to Today"
                                >
                                    <Clock className="h-3.5 w-3.5 text-primary" />
                                </Button>
                            </div>

                            {isAdmin && (
                                <EventFormDialog
                                    isDialogOpen={isFormOpen}
                                    setIsDialogOpen={setIsFormOpen}
                                    editingEventId={activeEvent?.id || null}
                                    onSubmit={onFormSubmit}
                                    isPending={isProcessing}
                                    initialDate={selectedDate}
                                    initialEvent={activeEvent || undefined}
                                />
                            )}
                        </CardHeader>

                        <CardContent className="flex-1 flex flex-col items-center justify-start p-3 sm:p-4">
                            {isLoading ? (
                                <div className="flex-1 flex items-center justify-center w-full">
                                    <div className="flex flex-col items-center gap-3">
                                        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-80" />
                                        <p className="text-sm text-muted-foreground animate-pulse">Syncing schedule...</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full space-y-3">
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={setSelectedDate}
                                        month={viewingMonth}
                                        onMonthChange={setViewingMonth}
                                        showOutsideDays={false}
                                        className="rounded-2xl bg-white/40 dark:bg-black/20 border border-primary/5 p-2 shadow-sm backdrop-blur-sm"
                                        classNames={{
                                            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full",
                                            month: "space-y-4 w-full",
                                            caption: "flex justify-center pt-1 pb-2 relative items-center w-full mb-1 border-b border-primary/5",
                                            caption_label: "text-sm font-bold text-foreground/80",
                                            nav: "space-x-1 flex items-center",
                                            nav_button: "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 hover:text-primary transition-all border-none",
                                            nav_button_previous: "absolute left-2",
                                            nav_button_next: "absolute right-2",
                                            table: "w-full border-collapse",
                                            head_row: "flex w-full justify-between mb-1",
                                            head_cell: "text-primary/60 rounded-md w-full font-bold text-[8px] sm:text-[9px] text-center uppercase tracking-widest",
                                            row: "flex w-full justify-between mt-0.5",
                                            cell: "h-9 w-full text-center text-[11px] sm:text-sm p-0 sm:p-0.5 relative",
                                            day: "h-full w-full p-0 font-medium hover:bg-primary/5 rounded-lg transition-all duration-200 border border-transparent hover:border-primary/10",
                                        }}
                                        components={{
                                            DayContent: (props) => {
                                                const dateKey = format(props.date, "yyyy-MM-dd");
                                                return <DayCell date={props.date} events={groupedEvents[dateKey] || []} />;
                                            }
                                        }}
                                    />
                                    <div className="pt-0">
                                        <CalendarLegend />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-700">
                    <EventDetailsCard
                        date={selectedDate}
                        events={events}
                        isAdmin={isAdmin}
                        onEdit={onEditInitiated}
                        onDelete={onDeleteInitiated}
                    />

                    <UpcomingEventsCard
                        events={events}
                        onDateSelect={setSelectedDate}
                        isAdmin={isAdmin}
                        onEdit={onEditInitiated}
                        onDelete={onDeleteInitiated}
                    />
                </div>
            </div>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent className="max-w-[400px]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl">Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the event from the academic calendar.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 mt-4">
                        <AlertDialogCancel className="font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold shadow-lg shadow-destructive/20"
                        >
                            Delete Event
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </MainLayout>
    );
}
