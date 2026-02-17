import { useState, useEffect } from "react";
import api from "@/lib/api";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/common/StatCard";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";

import { Announcement, RecentActivity, AnnouncementForm, DashboardStats } from "./types";
import { initialStats } from "./constants";

import { WelcomeBanner } from "./components/WelcomeBanner";
import { AnnouncementsCard } from "./components/AnnouncementsCard";
import { QuickActions } from "./components/QuickActions";
import { AnnouncementDialog } from "./components/AnnouncementDialog";
import { AnnouncementDetailsDialog } from "./components/AnnouncementDetailsDialog";

export function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>(initialStats);

  const [isAnnouncementDialogOpen, setIsAnnouncementDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [editingAnnouncementId, setEditingAnnouncementId] = useState<number | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const [announcementForm, setAnnouncementForm] = useState<AnnouncementForm>({
    title: "",
    content: "",
    isEveryone: true,
    targetRoles: ["all"],
    targetDepartments: ["all"],
    targetPrograms: ["all"],
    targetGroups: ["all"],
  });

  useEffect(() => {
    if (user?.role === "super_admin") {
      api
        .get("/dashboard")
        .then((response) => {
          const { studentCount, courseCount, programCount } = response.data;

          setDashboardStats((prev) => ({
            ...prev,
            super_admin: prev.super_admin.map((stat) => {
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
    }
  }, [user]);

  if (!user) return null;

  const userRole = user.role as keyof DashboardStats;
  const stats = dashboardStats[userRole] || dashboardStats.admin;

  const isSuperAdmin = user.role === "super_admin";
  const isAdmin = user.role === "admin" || isSuperAdmin;
  const isStaff = user.role === "staff" || user.role === "teacher";

  const cleanName = user.name.replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s+/i, '').split(" ")[0];

  const primaryStat = stats[0];

  const ctaLabel = user.role === 'student' ? 'Check Attendance' : (isStaff ? 'Mark Attendance' : 'Manage Users');
  const ctaLink = user.role === 'student' ? '/attendance' : (isStaff ? '/attendance' : '/users');

  const handleOpenCreateDialog = () => {
    setEditingAnnouncementId(null);
    setAnnouncementForm({
      title: "",
      content: "",
      isEveryone: true,
      targetRoles: ["all"],
      targetDepartments: ["all"],
      targetPrograms: ["all"],
      targetGroups: ["all"]
    });
    setIsAnnouncementDialogOpen(true);
  };

  const handleOpenEditDialog = (announcement: Announcement) => {
    const isEveryone = announcement.targetRoles.includes("all") &&
      announcement.targetDepartments.includes("all") &&
      announcement.targetGroups.includes("all");

    setEditingAnnouncementId(announcement.id);
    setAnnouncementForm({
      title: announcement.title,
      content: announcement.content || "",
      isEveryone,
      targetRoles: announcement.targetRoles || ["all"],
      targetDepartments: announcement.targetDepartments || ["all"],
      targetPrograms: announcement.targetPrograms || ["all"],
      targetGroups: announcement.targetGroups || ["all"],
    });
    setIsAnnouncementDialogOpen(true);
  };

  const handleSaveAnnouncement = () => {
    if (!announcementForm.title.trim()) {
      toast({ title: "Please enter a title", variant: "destructive" });
      return;
    }

    if (editingAnnouncementId) {
      setAnnouncements(prev => prev.map(a =>
        a.id === editingAnnouncementId
          ? { ...a, ...announcementForm }
          : a
      ));
      toast({ title: "Announcement updated" });
    } else {
      const newEntry: Announcement = {
        id: Date.now(),
        ...announcementForm,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      };
      setAnnouncements(prev => [newEntry, ...prev]);
      toast({ title: "Announcement published" });
    }

    setIsAnnouncementDialogOpen(false);
  };

  const filteredAnnouncements = announcements.filter(a => {
    if (isSuperAdmin) return true;

    const roleMatch = a.targetRoles.includes("all") || a.targetRoles.includes(user.role);
    const deptMatch = a.targetDepartments.includes("all") || (user.department && a.targetDepartments.includes(user.department));
    const programMatch = a.targetPrograms?.includes("all") || (user.program && a.targetPrograms?.includes(user.program));
    const groupMatch = a.targetGroups?.includes("all") || (user.group && a.targetGroups?.includes(user.group));

    return roleMatch && deptMatch && programMatch && groupMatch;
  });

  const handleDeleteAnnouncement = (id: number) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    toast({ title: "Announcement deleted" });
  };

  const handleViewDetails = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setIsDetailDialogOpen(true);
  };

  return (
    <MainLayout title="Dashboard">
      <div className="space-y-6">
        <WelcomeBanner
          name={cleanName}
          primaryStat={primaryStat}
          ctaLabel={ctaLabel}
          ctaLink={ctaLink}
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
            isSuperAdmin={isSuperAdmin}
            onViewDetails={handleViewDetails}
            onEdit={handleOpenEditDialog}
            onDelete={handleDeleteAnnouncement}
            onCreate={handleOpenCreateDialog}
          />
        </div>

        <QuickActions
          role={user.role}
          isAdmin={isAdmin}
          isStaff={isStaff}
        />
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
