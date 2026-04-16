import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarEvent, EVENT_TYPE_CONFIG } from "./CalendarTypes";

interface EventDialogProps {
  editingEventId: string | null;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  onSubmit: (event: Partial<CalendarEvent>) => void;
  initialDate?: Date;
  isPending: boolean;
  initialEvent?: Partial<CalendarEvent>;
}

export function EventDialog({
  editingEventId,
  isDialogOpen,
  setIsDialogOpen,
  onSubmit,
  initialDate,
  isPending,
  initialEvent,
}: EventDialogProps) {
  const [formData, setFormData] = useState<Partial<CalendarEvent>>({
    title: "",
    type: "event",
    date: initialDate || new Date(),
  });

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    if (initialEvent) {
      setFormData(initialEvent);
    } else {
      setFormData({
        title: "",
        type: "event",
        date: initialDate || new Date(),
      });
    }
  }, [initialEvent, initialDate, isDialogOpen]);

  const handleSubmit = () => {
    if (!formData.title?.trim()) return;
    onSubmit(formData);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="gap-2 shadow-lg hover:shadow-primary/20 transition-all active:scale-95 text-xs font-bold"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden xs:inline">Add Event</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {editingEventId ? "Edit Event" : "Create New Event"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground/70">
            {editingEventId
              ? "Update the details of the selected academic event."
              : "Fill in the form below to add a new event to the academic calendar."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? (
                    format(formData.date, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => {
                    setFormData({ ...formData, date });
                    setIsCalendarOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g. Science Fair"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value as any })
              }
            >
              {Object.entries(EVENT_TYPE_CONFIG).map(([type, config]) => (
                <option key={type} value={type}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="ghost"
            onClick={() => setIsDialogOpen(false)}
            className="hover:bg-muted font-medium"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || !formData.title?.trim()}
            className="min-w-[120px] font-bold"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {editingEventId ? "Update Changes" : "Save Event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
