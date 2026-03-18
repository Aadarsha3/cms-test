import { Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { RecentActivity } from "../types";

interface RecentActivityCardProps {
    activities: RecentActivity[];
}

export function RecentActivityCard({ activities }: RecentActivityCardProps) {
    return (
        <Card className="bg-white dark:bg-zinc-900 border-[#243F76]/10 dark:border-white/10 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-3 bg-muted/20 border-b border-[#243F76]/5 dark:border-white/5">
                <CardTitle className="text-xs font-bold text-[#1A2E56] dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Bell className="h-4 w-4 text-[#106bc6]" />
                    Recent Activity
                </CardTitle>
                <Link href="/activity">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-[#106bc6] border-[#106bc6]/20 bg-[#106bc6]/10 hover:bg-[#106bc6] hover:text-white font-bold text-[10px] transition-all"
                        data-testid="button-view-all-activity"
                    >
                        VIEW ALL
                    </Button>
                </Link>
            </CardHeader>
            <CardContent className="p-4">
                <div className="space-y-4">
                    {activities.length > 0 ? (
                        activities.map((activity) => (
                            <div
                                key={activity.id}
                                className="flex items-start gap-3 pb-3 border-b border-dashed last:border-0 last:pb-0"
                                data-testid={`activity-item-${activity.id}`}
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#106bc6]/10 text-[#106bc6] flex-shrink-0">
                                    <Bell className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-[#1A2E56] dark:text-gray-300">{activity.message}</p>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">{activity.time}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                            No recent activity
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
