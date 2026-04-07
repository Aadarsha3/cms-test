import { cn } from "@/lib/utils";
import { CalendarEvent, EVENT_TYPE_CONFIG } from "../CalendarTypes";

interface DayCellProps {
    date: Date;
    events: CalendarEvent[];
}

export function DayCell({ date, events }: DayCellProps) {
    const dayEvents = events.filter(e =>
        e.date.getDate() === date.getDate() &&
        e.date.getMonth() === date.getMonth() &&
        e.date.getFullYear() === date.getFullYear()
    );

    // Prioritize holiday for background, then academic, then event
    const holiday = dayEvents.find(e => e.type === 'holiday');
    const academic = dayEvents.find(e => e.type === 'academic');
    const normalEvent = dayEvents.find(e => e.type === 'event');

    const primaryType = holiday ? 'holiday' : (academic ? 'academic' : (normalEvent ? 'event' : null));
    const config = primaryType ? EVENT_TYPE_CONFIG[primaryType] : null;

    return (
        <div className={cn(
            "relative w-full h-full flex flex-col items-center justify-center transition-all rounded-md",
            config?.cellBg
        )}>
            <span className={cn(
                "text-sm font-semibold",
                config?.cellText
            )}>
                {date.getDate()}
            </span>
            {dayEvents.length > 0 && (
                <div className="flex gap-0.5 justify-center w-full mt-0.5 flex-wrap px-0.5 absolute bottom-1">
                    {dayEvents.slice(0, 3).map((e, i) => (
                        <div
                            key={i}
                            className={cn(
                                "w-1 h-1 rounded-full shadow-sm",
                                e.type === 'holiday' && "opacity-90"
                            )}
                            style={{ backgroundColor: e.color || EVENT_TYPE_CONFIG[e.type].color }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
