import { EVENT_TYPE_CONFIG } from "../CalendarTypes";

export function Legend() {
    return (
        <div className="flex flex-wrap gap-4 sm:gap-6 justify-center mt-4 sm:mt-8 pt-4 sm:pt-8 border-t w-full">
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
