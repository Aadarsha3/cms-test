import { useState, useEffect } from "react";
import { dashboardApi } from "@/lib/api";
import { MainLayout } from "@/components/core/layout/MainLayout";
import { StatCard } from "@/components/common/StatCard";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";

import { Announcement, RecentActivity, AnnouncementForm, DashboardStats } from "./types";
import { initialStats } from "./constants";

import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { AnnouncementsCard } from "@/components/dashboard/AnnouncementsCard";
import { AnnouncementDialog } from "@/components/dashboard/AnnouncementDialog";
import { AnnouncementDetailsDialog } from "@/components/dashboard/AnnouncementDetailsDialog";

export function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>(initialStats);

  const [isAnnouncementDialogOpen, setIsAnnouncementDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [editingAnnouncementId, setEditingAnnouncementId] = useState<string | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const [announcementForm, setAnnouncementForm] = useState<AnnouncementForm>({
    title: "",
    details: "",
  });

  const fetchAnnouncements = async () => {
    setLoadingAnnouncements(true);
    try {
      const response = await dashboardApi.get("/announcements?&size=3&sort=createdDate&direction=DSC");
      const data = Array.isArray(response.data) ? response.data : (response.data as any)?.content || [];
      // Format backend response to match UI needs
      const formattedData = data.map((item: any) => {
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
      setAnnouncements(formattedData);
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
    } finally {
      setLoadingAnnouncements(false);
    }
  };

  useEffect(() => {
    // Fetch common stats for everyone
    dashboardApi
      .get("/dashboard")
      .then((response) => {
        const { studentCount, courseCount, programCount } = response.data;

        setDashboardStats((prev) => ({
          ...prev,
          admin: prev.admin.map((stat) => {
            if (stat.title === "Total Students") return { ...stat, value: String(studentCount) };
            if (stat.title === "Courses") return { ...stat, value: String(courseCount) };
            if (stat.title === "Active Programs") return { ...stat, value: String(programCount) };
            return stat;
          }),
        }));
      })
      .catch((err) => {
        console.error("Dashboard stats fetch failed:", err);
      });

    fetchAnnouncements();
  }, [user]);

  if (!user) return null;

  const stats = dashboardStats.admin;

  const isAdmin = user.role === "admin";

  const handleOpenCreateDialog = () => {
    setEditingAnnouncementId(null);
    setAnnouncementForm({
      title: "",
      details: "",
    });
    setIsAnnouncementDialogOpen(true);
  };

  const handleOpenEditDialog = (announcement: Announcement) => {
    setEditingAnnouncementId(announcement.id);
    setAnnouncementForm({
      title: announcement.title,
      details: announcement.details || "",
    });
    setIsAnnouncementDialogOpen(true);
  };

  const handleSaveAnnouncement = async () => {
    if (!announcementForm.title.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }

    try {
      if (editingAnnouncementId) {
        // According to API specification, we use PATCH for modifications
        await dashboardApi.patch(`/announcements/${editingAnnouncementId}`, [
          { op: "replace", path: "/title", value: announcementForm.title },
          { op: "replace", path: "/details", value: announcementForm.details },
        ]);
        toast({ title: "Announcement updated successfully" });
      } else {
        await dashboardApi.post("/announcements", announcementForm);
        toast({ title: "Announcement published successfully" });
      }
      fetchAnnouncements();
      setIsAnnouncementDialogOpen(false);
    } catch (err) {
      console.error("Failed to save announcement:", err);
      toast({ title: "Failed to save announcement", variant: "destructive" });
    }
  };

  const filteredAnnouncements = announcements;

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      await dashboardApi.delete(`/announcements/${id}`);
      setAnnouncements(prev => prev.filter(a => a.id !== id));
      toast({ title: "Announcement deleted" });
    } catch (err) {
      console.error("Failed to delete announcement:", err);
      toast({ title: "Failed to delete announcement", variant: "destructive" });
    }
  };

  const handleViewDetails = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setIsDetailDialogOpen(true);
  };

  return (
    <MainLayout title="Dashboard">
      <div className="space-y-6">
        <WelcomeBanner
          name={user.name}
        />

        <div
          className={`grid gap-4 grid-cols-1 sm:grid-cols-2 ${stats.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
            }`}
        >
          {stats.map((stat, index) => (
            <StatCard
              key={stat.title}
              {...stat}
              testId={`stat-card-${index}`}
            />
          ))}
        </div>

        <div className="grid gap-6">
          <AnnouncementsCard
            announcements={filteredAnnouncements}
            isAdmin={isAdmin}
            onViewDetails={handleViewDetails}
            onCreate={handleOpenCreateDialog}
          />
        </div>
      </div>

      <AnnouncementDialog
        isOpen={isAnnouncementDialogOpen}
        onClose={() => setIsAnnouncementDialogOpen(false)}
        onSave={handleSaveAnnouncement}
        form={announcementForm}
        setForm={setAnnouncementForm}
        isEditing={!!editingAnnouncementId}
      />

      <AnnouncementDetailsDialog
        isOpen={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
        announcement={selectedAnnouncement}
      />
    </MainLayout>
  );
}

export default DashboardPage;
