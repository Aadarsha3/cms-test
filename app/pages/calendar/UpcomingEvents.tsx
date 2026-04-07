
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarEvent, EVENT_TYPE_CONFIG } from "./CalendarTypes";

interface UpcomingEventsProps {
    events: CalendarEvent[];
    onDateSelect: (date: Date) => void;
}

export function UpcomingEvents({ events, onDateSelect }: UpcomingEventsProps) {
    const [showAll, setShowAll] = useState(false);

    const allUpcomingEvents = events
        .filter((event) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return event.date >= today;
        })
        .sort((a, b) => a.date.getTime() - b.date.getTime());

    const displayedEvents = showAll ? allUpcomingEvents : allUpcomingEvents.slice(0, 3);

    return (
        <Card className="flex-1 flex flex-col border border-primary/5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.1)] bg-card/60 backdrop-blur-xl overflow-hidden ring-1 ring-white/10">
            <CardHeader className="py-2.5 px-4">
                <CardTitle className="text-sm font-bold">
                    Upcoming Events
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-3 pt-0">
                <div className="space-y-2">
                    <AnimatePresence initial={false}>
                        {displayedEvents.map((event, index) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
                                transition={{ delay: index * 0.05 }}
                                className={cn(
                                    "flex gap-4 items-center p-2 rounded-lg hover:bg-white dark:hover:bg-zinc-800/50 shadow-sm hover:shadow-md transition-all cursor-pointer group",
                                    event.type === 'holiday' && "opacity-80"
                                )}
                                onClick={() => onDateSelect(event.date)}
                            >
                                <div className="flex flex-col items-center bg-white dark:bg-zinc-950 rounded-lg py-1.5 px-2 min-w-[3rem] text-center shadow-sm border group-hover:border-primary/30 transition-all">
                                    <span className="text-[9px] font-bold uppercase text-primary/70">{format(event.date, "MMM")}</span>
                                    <span className="text-base font-black tracking-tighter">{format(event.date, "d")}</span>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold leading-none mb-1 group-hover:text-primary transition-colors truncate">{event.title}</p>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="h-2 w-2 rounded-full shadow-inner"
                                            style={{ backgroundColor: event.color || EVENT_TYPE_CONFIG[event.type].color }}
                                        />
                                        <span className="text-[10px] font-medium text-muted-foreground uppercase">
                                            {EVENT_TYPE_CONFIG[event.type].label}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {allUpcomingEvents.length > 3 && (
                        <div className="pt-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full h-8 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary hover:bg-primary/5 gap-1.5 border border-dashed border-primary/10"
                                onClick={() => setShowAll(!showAll)}
                            >
                                {showAll ? (
                                    <>
                                        <ChevronUp className="h-3.5 w-3.5" />
                                        Show Less
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown className="h-3.5 w-3.5" />
                                        Show {allUpcomingEvents.length - 3} More Events
                                    </>
                                )}
                            </Button>
                        </div>
                    )}

                    {allUpcomingEvents.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-6 text-muted-foreground/40">
                            <p className="text-sm font-medium">No upcoming events.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
