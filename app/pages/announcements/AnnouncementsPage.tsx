import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { dashboardApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { AnnouncementForm, Announcement } from "@/pages/dashboard/types";
import { AnnouncementsView } from "./AnnouncementsView";

export default function AnnouncementsPage() {
    const { hasPermission } = useAuth();
    const { toast } = useToast();
    const [, setLocation] = useLocation();
    const canView = hasPermission("announcements_view");
    const canCreate = hasPermission("announcements_create");

    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<AnnouncementForm>({ title: "", details: "" });

    const fetchAnnouncements = async () => {
        if (!canView) return;
        setLoading(true);
        try {
            const response = await dashboardApi.get(`/announcements?page=${page}&size=${size}&sort=createdDate&direction=DSC`);
            const data = response.data;

            const content = Array.isArray(data) ? data : data.content || [];
            const total = Array.isArray(data) ? 1 : data.totalPages || 1;
            const totalElems = Array.isArray(data) ? data.length : data.totalElements || 0;

            const formatted = content.map((item: any) => {
                let dateObj = new Date();
                if (Array.isArray(item.createdDate)) {
                    const [y, m, d, h = 0, min = 0, s = 0] = item.createdDate;
                    dateObj = new Date(y, m - 1, d, h, min, s);
                } else if (item.createdDate || item.createdAt || item.createdTimestamp) {
                    dateObj = new Date(item.createdDate || item.createdAt || item.createdTimestamp);
                }

                return {
                    id: item.id,
                    title: item.title,
                    details: item.details,
                    date: dateObj.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                    }),
                };
            });
            setAnnouncements(formatted);
            setTotalPages(total);
            setTotalElements(totalElems);
        } catch (err) {
            console.error(err);
            toast({ title: "Failed to load announcements", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (canView) {
            fetchAnnouncements();
        } else {
            setLoading(false);
        }
    }, [page, size, canView]);

    const handleCreate = () => {
        setEditingId(null);
        setForm({ title: "", details: "" });
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        if (!form.title.trim()) {
            toast({ title: "Title is required", variant: "destructive" });
            return;
        }

        try {
            await dashboardApi.post("/announcements", form);
            toast({ title: "Announcement published successfully" });
            fetchAnnouncements();
            setIsDialogOpen(false);
        } catch (err) {
            console.error("Failed to save announcement:", err);
            toast({ title: "Failed to save announcement", variant: "destructive" });
        }
    };

    const filtered = announcements.filter(a =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        (a.details && a.details.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <AnnouncementsView
            loading={loading}
            search={search}
            setSearch={setSearch}
            size={size}
            setSize={setSize}
            setPage={setPage}
            fetchAnnouncements={fetchAnnouncements}
            handleCreate={handleCreate}
            isAdmin={canCreate}
            filtered={filtered}
            setLocation={setLocation}
            totalPages={totalPages}
            page={page}
            totalElements={totalElements}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            handleSave={handleSave}
            form={form}
            setForm={setForm}
        />
    );
}
