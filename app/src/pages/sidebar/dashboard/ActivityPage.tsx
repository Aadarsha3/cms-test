import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, CheckCircle, AlertCircle, Info, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

// Extended mock data for demonstration
const extendedActivity = [
    { id: 1, type: "enrollment", message: "New student enrolled in Computer Science", time: "2 hours ago", icon: Info },
    { id: 2, type: "grade", message: "Grades published for CS301 - Database Systems", time: "5 hours ago", icon: CheckCircle },
    { id: 3, type: "attendance", message: "Attendance marked for Morning Batch", time: "Today, 9:00 AM", icon: CheckCircle },
    { id: 4, type: "program", message: "New program added: Data Science Masters", time: "Yesterday", icon: AlertCircle },
    { id: 5, type: "system", message: "System maintenance scheduled for weekend", time: "2 days ago", icon: Info },
    { id: 6, type: "user", message: "New staff member registered: Dr. Sarah Smith", time: "3 days ago", icon: Info },
    { id: 7, type: "enrollment", message: "Student transfer request approved", time: "3 days ago", icon: CheckCircle },
    { id: 8, type: "grade", message: "Updated grade curve for Physics 101", time: "4 days ago", icon: AlertCircle },
    { id: 9, type: "attendance", message: "Weekly attendance report generated", time: "Last week", icon: CheckCircle },
    { id: 10, type: "system", message: "Backup completed successfully", time: "Last week", icon: CheckCircle },
];

export function ActivityPage() {
    const [filter, setFilter] = useState("");

    const filteredActivities = extendedActivity.filter(activity =>
        activity.message.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <MainLayout title="Recent Activity">
            <div className="space-y-6">
                <div className="bg-white dark:bg-card border border-[#243F76]/10 dark:border-white/10 rounded-xl p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold text-[#1A2E56] dark:text-white flex items-center gap-2">
                                <Bell className="h-5 w-5 text-[#106bc6]" />
                                System Activity Log
                            </h2>
                            <p className="text-sm text-muted-foreground">Monitor recent system events, updates, and changes.</p>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <div className="relative flex-1 sm:w-64">
                                <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search activity..."
                                    className="pl-9 bg-muted/20 border-[#243F76]/10"
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-0 relative border-l-2 border-dashed border-muted ml-3 pl-6 pb-2">
                        {filteredActivities.length > 0 ? (
                            filteredActivities.map((activity) => (
                                <div key={activity.id} className="relative mb-8 last:mb-0 group">
                                    {/* Timeline dot */}
                                    <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-white dark:bg-card border-2 border-[#106bc6] shadow-sm z-10 group-hover:scale-125 transition-transform" />

                                    <Card className="shadow-sm border-[#243F76]/5 dark:border-white/5 bg-white dark:bg-zinc-900/50 hover:shadow-md transition-shadow">
                                        <CardContent className="p-4 flex items-start gap-4">
                                            <div className={`p-2 rounded-lg bg-primary/10 text-primary shrink-0`}>
                                                <activity.icon className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                                                    <p className="font-semibold text-[#1A2E56] dark:text-white text-sm">{activity.message}</p>
                                                    <span className="text-xs font-medium text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full w-fit">
                                                        {activity.time}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    Activity ID: #{activity.id} • Type: <span className="capitalize">{activity.type}</span>
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))
                        ) : (
                            <div className="py-8 text-center text-muted-foreground text-sm">
                                No activity found matching "{filter}"
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
