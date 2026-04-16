import { EVENT_TYPE_CONFIG } from "@/pages/calendar/CalendarTypes";

export function Legend() {
    return (
        <div className="flex flex-wrap gap-3 sm:gap-4 justify-center mt-2 pt-2 border-t w-full">
            {Object.entries(EVENT_TYPE_CONFIG).map(([type, config]) => (
                <div key={type} className="flex items-center gap-2 group cursor-pointer">
                    <div
                        className="w-4 h-4 rounded-full shadow-sm border-2 border-white ring-1 ring-primary/20 transition-transform group-hover:scale-110"
                        style={{ backgroundColor: config.color }}
                    ></div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                        {config.label}
                    </span>
                </div>
            ))}
        </div>
    );
}
