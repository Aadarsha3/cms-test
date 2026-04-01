// /app/src/pages/sidebar/announcement_management/AnnouncementsPage.tsx

import { useState, useEffect } from "react";
import { dashboardApi } from "@/lib/api";
import { MainLayout } from "@/components/layout/MainLayout";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { Plus, Search, Loader2, RefreshCw, Megaphone, Edit, Trash2, Eye, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AnnouncementForm, Announcement } from "../dashboard/types";
import { AnnouncementDialog } from "../dashboard/components/AnnouncementDialog";
import { AnnouncementDetailsDialog } from "../dashboard/components/AnnouncementDetailsDialog";

export default function AnnouncementsPage() {
    const { hasPermission } = useAuth();
    const { toast } = useToast();
    const isAdmin = hasPermission("users_edit");

    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
    const [form, setForm] = useState<AnnouncementForm>({ title: "", details: "" });

    const fetchAnnouncements = async () => {
        setLoading(true);
        try {
            const response = await dashboardApi.get("/announcements");
            const data = Array.isArray(response.data) ? response.data : (response.data as any)?.content || [];
            const formatted = data.map((item: any) => ({
                id: item.id,
                title: item.title,
                details: item.details,
                date: item.createdTimestamp ? new Date(item.createdTimestamp).toLocaleDateString() : "Recently",
            }));
            setAnnouncements(formatted);
        } catch (err) {
            console.error(err);
            toast({ title: "Failed to load announcements", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handleCreate = () => {
        setEditingId(null);
        setForm({ title: "", details: "" });
        setIsDialogOpen(true);
    };

    const handleEdit = (announcement: Announcement) => {
        setEditingId(announcement.id);
        setForm({ title: announcement.title, details: announcement.details || "" });
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        if (!form.title.trim()) return;
        try {
            if (editingId) {
                await dashboardApi.patch(`/announcements/${editingId}`, [
                    { op: "replace", path: "/title", value: form.title },
                    { op: "replace", path: "/details", value: form.details },
                ]);
                toast({ title: "Updated successfully" });
            } else {
                await dashboardApi.post("/announcements", form);
                toast({ title: "Published successfully" });
            }
            fetchAnnouncements();
            setIsDialogOpen(false);
        } catch (err) {
            toast({ title: "Error saving announcement", variant: "destructive" });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this announcement?")) return;
        try {
            await dashboardApi.delete(`/announcements/${id}`);
            setAnnouncements(prev => prev.filter(a => a.id !== id));
            toast({ title: "Deleted successfully" });
        } catch (err) {
            toast({ title: "Error deleting announcement", variant: "destructive" });
        }
    };

    const filtered = announcements.filter(a => 
        a.title.toLowerCase().includes(search.toLowerCase()) || 
        (a.details && a.details.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <MainLayout title="Announcements Management">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search announcements..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 bg-white dark:bg-zinc-950 border-[#243F76]/10 dark:border-white/10"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Button variant="outline" size="icon" onClick={fetchAnnouncements} disabled={loading}>
                            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                        </Button>
                        {isAdmin && (
                            <Button onClick={handleCreate} className="gap-2 shadow-md flex-1 sm:flex-none">
                                <Plus className="h-4 w-4" /> Post New
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {loading ? (
                        <div className="flex items-center justify-center h-40 opacity-50"><Loader2 className="h-8 w-8 animate-spin" /></div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-20 opacity-40"><Megaphone className="h-10 w-10 mx-auto mb-2" /><p>No announcements found</p></div>
                    ) : (
                        filtered.map((announcement) => (
                            <Card key={announcement.id} className="group border-[#243F76]/10 dark:border-white/10 hover:shadow-md transition-all">
                                <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="space-y-1.5 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-lg text-[#1A2E56] dark:text-white truncate">{announcement.title}</h3>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {announcement.date}</span>
                                            {announcement.details && <span className="truncate opacity-70 border-l pl-3 hidden md:inline">{announcement.details.substring(0, 100)}...</span>}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => { setSelectedAnnouncement(announcement); setIsDetailDialogOpen(true); }}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        {isAdmin && (
                                            <>
                                                <Button variant="ghost" size="icon" className="rounded-full text-blue-500 hover:text-blue-600 hover:bg-blue-50" onClick={() => handleEdit(announcement)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="rounded-full text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(announcement.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    ))}
                </div>
            </div>

            <AnnouncementDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSave={handleSave}
                form={form}
                setForm={setForm}
                isEditing={!!editingId}
            />

            <AnnouncementDetailsDialog
                isOpen={isDetailDialogOpen}
                onClose={() => setIsDetailDialogOpen(false)}
                announcement={selectedAnnouncement}
            />
        </MainLayout>
    );
}
