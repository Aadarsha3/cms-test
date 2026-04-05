import { useState, useEffect } from "react";
import { dashboardApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";

import { Announcement, AnnouncementForm, DashboardStats } from "./types";
import { Users, GraduationCap, BookOpen } from "lucide-react";
import { DashboardView } from "./DashboardView";

const initialStats: DashboardStats = [
    { title: "Total Students", value: "0", icon: Users },
    { title: "Active Programs", value: "0", icon: GraduationCap },
    { title: "Courses", value: "0", icon: BookOpen },
];

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
    dashboardApi
      .get("/dashboard")
      .then((response) => {
        const { studentCount, courseCount, programCount } = response.data;

        setDashboardStats((prev) => 
          prev.map((stat) => {
            if (stat.title === "Total Students") return { ...stat, value: String(studentCount) };
            if (stat.title === "Courses") return { ...stat, value: String(courseCount) };
            if (stat.title === "Active Programs") return { ...stat, value: String(programCount) };
            return stat;
          })
        );
      })
      .catch((err) => {
        console.error("Dashboard stats fetch failed:", err);
      });

    fetchAnnouncements();
  }, [user]);

  if (!user) return null;

  const isAdmin = user.role === "admin";

  const handleOpenCreateDialog = () => {
    setEditingAnnouncementId(null);
    setAnnouncementForm({
      title: "",
      details: "",
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

  const handleViewDetails = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setIsDetailDialogOpen(true);
  };

  return (
    <DashboardView
      user={user}
      stats={dashboardStats}
      announcements={announcements}
      isAdmin={isAdmin}
      isAnnouncementDialogOpen={isAnnouncementDialogOpen}
      setIsAnnouncementDialogOpen={setIsAnnouncementDialogOpen}
      isDetailDialogOpen={isDetailDialogOpen}
      setIsDetailDialogOpen={setIsDetailDialogOpen}
      selectedAnnouncement={selectedAnnouncement}
      announcementForm={announcementForm}
      setAnnouncementForm={setAnnouncementForm}
      editingAnnouncementId={editingAnnouncementId}
      handleOpenCreateDialog={handleOpenCreateDialog}
      handleSaveAnnouncement={handleSaveAnnouncement}
      handleViewDetails={handleViewDetails}
    />
  );
}

export default DashboardPage;

