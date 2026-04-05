import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/common/StatCard";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { AnnouncementsCard } from "@/components/announcement/AnnouncementsCard";
import { AnnouncementDialog } from "@/components/announcement/AnnouncementDialog";
import { AnnouncementDetailsDialog } from "@/components/announcement/AnnouncementDetailsDialog";
import { Announcement, AnnouncementForm, DashboardStats } from "./types";

interface DashboardViewProps {
  user: { name: string; role: string } | null;
  stats: DashboardStats;
  announcements: Announcement[];
  isAdmin: boolean;
  isAnnouncementDialogOpen: boolean;
  setIsAnnouncementDialogOpen: (open: boolean) => void;
  isDetailDialogOpen: boolean;
  setIsDetailDialogOpen: (open: boolean) => void;
  selectedAnnouncement: Announcement | null;
  announcementForm: AnnouncementForm;
  setAnnouncementForm: (form: AnnouncementForm) => void;
  editingAnnouncementId: string | null;
  handleOpenCreateDialog: () => void;
  handleSaveAnnouncement: () => void;
  handleViewDetails: (announcement: Announcement) => void;
}

export function DashboardView({
  user,
  stats,
  announcements,
  isAdmin,
  isAnnouncementDialogOpen,
  setIsAnnouncementDialogOpen,
  isDetailDialogOpen,
  setIsDetailDialogOpen,
  selectedAnnouncement,
  announcementForm,
  setAnnouncementForm,
  editingAnnouncementId,
  handleOpenCreateDialog,
  handleSaveAnnouncement,
  handleViewDetails,
}: DashboardViewProps) {
  if (!user) return null;

  return (
    <MainLayout title="Dashboard">
      <div className="space-y-6">
        <WelcomeBanner name={user.name} />

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
            announcements={announcements}
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
