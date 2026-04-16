import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { dashboardApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { Announcement } from "../dashboard/types";
import { AnnouncementDetailsView } from "./AnnouncementDetailsView";

export default function AnnouncementDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const { hasPermission } = useAuth();
    const canEdit = hasPermission("announcements_edit");
    const canDelete = hasPermission("announcements_delete");

    const [announcement, setAnnouncement] = useState<Announcement | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editForm, setEditForm] = useState({ title: "", details: "" });

    const fetchAnnouncement = async () => {
        setLoading(true);
        try {
            const response = await dashboardApi.get(`/announcements/${id}`);
            const data = response.data;
            let dateObj = new Date();
            if (Array.isArray(data.createdDate)) {
                const [y, m, d, h = 0, min = 0, s = 0] = data.createdDate;
                dateObj = new Date(y, m - 1, d, h, min, s);
            } else if (data.createdDate || data.createdAt || data.createdTimestamp) {
                dateObj = new Date(data.createdDate || data.createdAt || data.createdTimestamp);
            }

            const formatted = {
                id: data.id,
                title: data.title,
                details: data.details,
                date: dateObj.toLocaleDateString("en-US", {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
            };
            setAnnouncement(formatted);
            setEditForm({ title: data.title, details: data.details || "" });
        } catch (err) {
            toast({ title: "Failed to load announcement", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchAnnouncement();
    }, [id]);

    const handleSave = async () => {
        if (!editForm.title.trim() || !id) return;
        setIsSaving(true);
        try {
            await dashboardApi.patch(`/announcements/${id}`, [
                { op: "replace", path: "/title", value: editForm.title },
                { op: "replace", path: "/details", value: editForm.details },
            ]);
            toast({ title: "Updated successfully" });
            setIsEditing(false);
            fetchAnnouncement();
        } catch (err) {
            toast({ title: "Error saving announcement", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this announcement?")) return;
        try {
            await dashboardApi.delete(`/announcements/${id}`);
            toast({ title: "Deleted successfully" });
            setLocation("/announcements");
        } catch (err) {
            toast({ title: "Error deleting announcement", variant: "destructive" });
        }
    };

    return (
        <AnnouncementDetailsView
            announcement={announcement}
            loading={loading}
            isEditing={isEditing}
            isSaving={isSaving}
            editForm={editForm}
            setEditForm={setEditForm}
            setIsEditing={setIsEditing}
            handleSave={handleSave}
            handleDelete={handleDelete}
            isAdmin={canEdit}
            canDelete={canDelete}
            setLocation={setLocation}
        />
    );
}
