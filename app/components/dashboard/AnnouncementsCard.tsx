// /app/src/pages/sidebar/dashboard/components/AnnouncementsCard.tsx

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
import { Announcement } from "@/pages/sidebar/dashboard/types";
import { useLocation } from "wouter";

interface AnnouncementsCardProps {
    announcements: Announcement[];
    isSuperAdmin: boolean;
    onViewDetails: (announcement: Announcement) => void;
    onCreate: () => void;
    className?: string;
}

export function AnnouncementsCard({
    announcements,
    isSuperAdmin,
    onViewDetails,
    onCreate,
    className,
}: AnnouncementsCardProps) {
    const [, setLocation] = useLocation();
    return (
        <Card className={cn("overflow-hidden border-none shadow-premium bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div className="space-y-1">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <Megaphone className="h-5 w-5 text-primary" />
                        Announcements
                    </CardTitle>
                    <CardDescription>Stay updated with the latest campus news</CardDescription>
                </div>

                {isSuperAdmin && (
                    <Button
                        size="sm"
                        onClick={onCreate}
                        className="rounded-full px-4 bg-primary hover:bg-primary/90 shadow-sm"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Post New
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
                                className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-border/40 bg-white/40 dark:bg-black/20 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 cursor-pointer"
                            >
                                <div className="space-y-1 min-w-0">
                                    <h4 className="font-bold text-[#1A2E56] dark:text-white leading-tight group-hover:text-primary transition-colors flex items-center flex-wrap gap-x-2">
                                        <span>{announcement.title}</span>
                                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                                            {announcement.date}
                                        </span>
                                    </h4>
                                    {announcement.details && (
                                        <p className="text-xs text-muted-foreground line-clamp-1">
                                            {announcement.details}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                        <ChevronRight className="h-4 w-4" />
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
