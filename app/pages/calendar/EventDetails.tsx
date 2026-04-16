import { format } from "date-fns";
import { Edit2, Trash2, AlertCircle, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CalendarEvent, EVENT_TYPE_CONFIG } from "./CalendarTypes";

interface EventDetailsProps {
  date: Date | undefined;
  events: CalendarEvent[];
  isAdmin: boolean;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (id: string) => void;
}

export function EventDetails({
  date,
  events,
  isAdmin,
  onEdit,
  onDelete,
}: EventDetailsProps) {
  if (!date) return null;

  const selectedEvents = events.filter(
    (e) =>
      e.date.getDate() === date.getDate() &&
      e.date.getMonth() === date.getMonth() &&
      e.date.getFullYear() === date.getFullYear(),
  );

  return (
    <Card className="flex flex-col border border-primary/5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.1)] bg-card/60 backdrop-blur-xl overflow-hidden ring-1 ring-white/10 min-h-[115px]">
      <CardHeader className="py-2.5 px-4 border-b border-primary/5 bg-primary/[0.01]">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            {format(date, "MMMM d, yyyy")}
          </CardTitle>
          {selectedEvents.length > 0 && (
            <Badge
              variant="outline"
              className="text-[10px] h-5 bg-primary/5 border-primary/10"
            >
              {selectedEvents.length}{" "}
              {selectedEvents.length === 1 ? "Event" : "Events"}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-y-auto">
        {selectedEvents.length > 0 ? (
          <div className="divide-y divide-primary/5">
            {selectedEvents.map((event) => (
              <div
                key={event.id}
                className="group p-3 hover:bg-white dark:hover:bg-zinc-800/50 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <Badge
                        className={cn(
                          "text-[10px] font-bold px-1.5 py-0 h-4 border uppercase tracking-wider",
                          EVENT_TYPE_CONFIG[event.type].badge,
                        )}
                      >
                        {EVENT_TYPE_CONFIG[event.type].label}
                      </Badge>
                    </div>
                    <h4 className="text-sm font-bold leading-tight group-hover:text-primary transition-colors pr-2">
                      {event.title}
                    </h4>
                  </div>

                  {isAdmin && (
                    <div className="flex items-center gap-0.5 shrink-0 transition-all opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-primary/5 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(event);
                        }}
                        title="Edit Event"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full text-slate-600 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(event.id);
                        }}
                        title="Delete Event"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 min-h-[70px] text-center">
            <AlertCircle className="h-5 w-5 text-muted-foreground/20 mb-1" />
            <p className="text-xs font-medium text-muted-foreground/40">
              No events scheduled
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
