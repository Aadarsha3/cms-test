import { dashboardApi as api } from "@/lib/api";
import { ApiCalendarEvent, CalendarEvent, EVENT_TYPE_CONFIG } from "./CalendarTypes";

/**
 * Transforms backend API event structure into our frontend UI format
 */
const mapApiEventToUI = (event: ApiCalendarEvent): CalendarEvent => {
    const type = (event.eventType.toLowerCase() as CalendarEvent["type"]) || "event";
    return {
        id: event.id,
        title: event.eventName,
        date: new Date(event.eventDate[0], event.eventDate[1] - 1, event.eventDate[2]),
        type,
        color: EVENT_TYPE_CONFIG[type]?.color || EVENT_TYPE_CONFIG.event.color,
    };
};

export const calendarService = {
    /**
     * Fetches events for a specific year and month
     */
    async getEventsByMonth(year: number, month: number): Promise<CalendarEvent[]> {
        const response = await api.get<any>(`/events/month?year=${year}&month=${month}`);

        if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
            throw new Error("Your session has expired. Please log in again.");
        }

        const rawData = response.data?.content || response.data?.data || response.data || [];
        const eventArray = Array.isArray(rawData) ? rawData : [];

        return eventArray.map((e: any) => {
            try { return mapApiEventToUI(e); } catch (err) { return null; }
        }).filter(Boolean) as CalendarEvent[];
    },

    /**
     * Creates a new event in the system
     */
    async createEvent(event: Omit<CalendarEvent, "id">): Promise<CalendarEvent> {
        const payload = {
            eventName: event.title,
            eventDate: [event.date.getFullYear(), event.date.getMonth() + 1, event.date.getDate()],
            eventType: event.type.toUpperCase(),
        };
        const response = await api.post<ApiCalendarEvent>("/events", payload);
        return mapApiEventToUI(response.data);
    },

    /**
     * Updates an existing event using JSON Patch
     */
    async updateEvent(id: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent> {
        const patch = [{ op: "add", path: "/id", value: id }];

        if (updates.title) patch.push({ op: "add", path: "/eventName", value: updates.title });
        if (updates.date) {
            patch.push({
                op: "add",
                path: "/eventDate",
                value: [updates.date.getFullYear(), updates.date.getMonth() + 1, updates.date.getDate()] as any
            });
        }
        if (updates.type) patch.push({ op: "add", path: "/eventType", value: updates.type.toUpperCase() });

        const response = await api.patch<ApiCalendarEvent>(`/events/${id}`, patch);
        return mapApiEventToUI(response.data);
    },

    /**
     * Deletes an event by ID
     */
    async deleteEvent(id: string): Promise<void> {
        await api.delete(`/events/${id}`);
    }
};
