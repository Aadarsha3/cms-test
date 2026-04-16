import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Megaphone, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Announcement } from "@/pages/dashboard/types";
import { useLocation } from "wouter";

interface AnnouncementsCardProps {
    announcements: Announcement[];
    isAdmin: boolean;
    onCreate: () => void;
    className?: string;
}

export function AnnouncementsCard({
    announcements,
    isAdmin,
    onCreate,
    className,
}: AnnouncementsCardProps) {
    const [, setLocation] = useLocation();
    return (
        <Card className={cn("overflow-hidden border-none shadow-premium bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 md:pb-3">
                <div className="space-y-0.5 md:space-y-1 pr-2">
                    <CardTitle className="text-lg md:text-xl font-bold flex items-center gap-2">
                        <Megaphone className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0" />
                        Announcements
                    </CardTitle>
                    <CardDescription className="text-[10px] md:text-sm line-clamp-1 italic">Stay updated with campus news</CardDescription>
                </div>

                {isAdmin && (
                    <Button
                        size="sm"
                        onClick={onCreate}
                        className="rounded-full px-3 sm:px-4 bg-primary hover:bg-primary/90 shadow-sm shrink-0 h-8 sm:h-9"
                    >
                        <Plus className="h-3.5 w-3.5 sm:mr-2" />
                        <span className="hidden sm:inline">Post New</span>
                    </Button>
                )}
            </CardHeader>

            <CardContent>
                <div className="space-y-4">
                    {announcements.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center opacity-40">
                            <Megaphone className="h-10 w-10 mb-2" />
                            <p className="text-sm">No active announcements</p>
                        </div>
                    ) : (
                        announcements.map((announcement) => (
                            <div
                                key={announcement.id}
                                onClick={() => setLocation(`/announcements/${announcement.id}`)}
                                className="group relative flex items-center justify-between gap-3 p-3 md:p-5 rounded-xl border border-border/40 bg-white/40 dark:bg-black/20 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 cursor-pointer"
                            >
                                <div className="space-y-1 min-w-0 flex-1">
                                    <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
                                        <h4 className="font-bold text-sm md:text-base text-[#1A2E56] dark:text-white leading-tight group-hover:text-primary transition-colors truncate max-w-[70%] sm:max-w-none">
                                            {announcement.title}
                                        </h4>
                                        <span className="text-[9px] md:text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
                                            {announcement.date}
                                        </span>
                                    </div>
                                    {announcement.details && (
                                        <p className="text-[10px] md:text-xs text-muted-foreground line-clamp-1">
                                            {announcement.details}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                        <ChevronRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
