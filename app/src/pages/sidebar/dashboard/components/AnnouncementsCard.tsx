import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Edit, Trash2, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Announcement } from "../types";

interface AnnouncementsCardProps {
    announcements: Announcement[];
    isSuperAdmin: boolean;
    onViewDetails: (announcement: Announcement) => void;
    onEdit: (announcement: Announcement) => void;
    onDelete: (id: number) => void;
    onCreate: () => void;
    className?: string;
}

export function AnnouncementsCard({
    announcements,
    isSuperAdmin,
    onViewDetails,
    onEdit,
    onDelete,
    onCreate,
    className,
}: AnnouncementsCardProps) {
    return (
        <Card className={cn("overflow-hidden border-none shadow-premium bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div className="space-y-1">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <Megaphone className="h-5 w-5 text-primary" />
                        Common Announcements
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
                                className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-border/40 bg-white/40 dark:bg-black/20 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5"
                            >
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-[#1A2E56] dark:text-white leading-tight">
                                            {announcement.title}
                                        </h4>
                                        {announcement.isEveryone && (
                                            <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-tighter h-5">
                                                Global
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <span>{announcement.date}</span>
                                        {announcement.content && (
                                            <span className="hidden sm:inline">
                                                • {announcement.content.substring(0, 60)}{announcement.content.length > 60 ? '...' : ''}
                                            </span>
                                        )}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                                        onClick={() => onViewDetails(announcement)}
                                        title="View details"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>

                                    {isSuperAdmin && (
                                        <>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 rounded-full hover:bg-blue-500/10 hover:text-blue-500"
                                                onClick={() => onEdit(announcement)}
                                                title="Edit announcement"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 rounded-full hover:bg-red-500/10 hover:text-red-500"
                                                onClick={() => onDelete(announcement.id)}
                                                title="Delete announcement"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
