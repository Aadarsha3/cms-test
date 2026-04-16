import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/common/StatCard";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { AnnouncementsCard } from "@/components/announcement/AnnouncementsCard";
import { AnnouncementDialog } from "@/components/announcement/AnnouncementDialog";
import { UpcomingEvents } from "@/pages/calendar/UpcomingEvents";
import { CalendarEvent } from "@/pages/calendar/CalendarTypes";
import { Announcement, AnnouncementForm, DashboardStats } from "./types";
import { useLocation } from "wouter";

interface DashboardViewProps {
  user: { name: string; role: string } | null;
  stats: DashboardStats;
  announcements: Announcement[];
  calendarEvents: CalendarEvent[];
  isAdmin: boolean;
  isAnnouncementDialogOpen: boolean;
  setIsAnnouncementDialogOpen: (open: boolean) => void;
  announcementForm: AnnouncementForm;
  setAnnouncementForm: (form: AnnouncementForm) => void;
  editingAnnouncementId: string | null;
  handleOpenCreateDialog: () => void;
  handleSaveAnnouncement: () => void;
}

export function DashboardView({
  user,
  stats,
  announcements,
  calendarEvents,
  isAdmin,
  isAnnouncementDialogOpen,
  setIsAnnouncementDialogOpen,
  announcementForm,
  setAnnouncementForm,
  editingAnnouncementId,
  handleOpenCreateDialog,
  handleSaveAnnouncement,
}: DashboardViewProps) {
  const [, navigate] = useLocation();

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

        <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
          <AnnouncementsCard
            announcements={announcements}
            isAdmin={isAdmin}
            onCreate={handleOpenCreateDialog}
          />
          <div className="flex flex-col gap-6">
            <UpcomingEvents 
              events={calendarEvents} 
              onDateSelect={() => navigate("/calendar")} 
              maxEvents={5}
              hideShowMore={true}
            />
          </div>
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
    </MainLayout>
  );
}
