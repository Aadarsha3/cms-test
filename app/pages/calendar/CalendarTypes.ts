export interface CalendarEvent {
    id: string;
    title: string;
    date: Date;
    type: "academic" | "holiday" | "event";
    color?: string;
}

export interface ApiCalendarEvent {
    id: string;
    eventName: string;
    eventDate: [number, number, number]; 
    eventType: string;
}

export const EVENT_TYPE_CONFIG = {
    academic: {
        label: "Academic",
        color: "#3b82f6",
        badge: "bg-blue-600 text-white border-blue-700",
        cellBg: "bg-blue-50/80 dark:bg-blue-900/20",
        cellText: "text-blue-600 dark:text-blue-400 font-semibold",
    },
    holiday: {
        label: "Holiday",
        color: "#ef4444",
        badge: "bg-red-100 text-red-700 border-red-200 shadow-none",
        cellBg: "bg-red-100/60 dark:bg-red-900/40 border-red-100 dark:border-red-800/50",
        cellText: "text-red-700 dark:text-red-300 font-bold",
    },
    event: {
        label: "Event",
        color: "#10b981",
        badge: "bg-emerald-600 text-white border-emerald-700",
        cellBg: "bg-emerald-50/80 dark:bg-emerald-900/20",
        cellText: "text-emerald-600 dark:text-emerald-400 font-semibold",
    },
} as const;
