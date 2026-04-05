import { Search, Loader2, Megaphone, Plus, RefreshCw, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { RowsSelector } from "@/components/common/RowsSelector";
import { MainLayout } from "@/components/layout/MainLayout";
import { AnnouncementDialog } from "@/components/announcement/AnnouncementDialog";
import { Announcement, AnnouncementForm } from "@/pages/dashboard/types";

interface AnnouncementsViewProps {
  loading: boolean;
  search: string;
  setSearch: (s: string) => void;
  size: number;
  setSize: (s: number) => void;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  fetchAnnouncements: () => void;
  handleCreate: () => void;
  isAdmin: boolean;
  filtered: Announcement[];
  setLocation: (loc: string) => void;
  totalPages: number;
  page: number;
  totalElements: number;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  handleSave: () => void;
  form: AnnouncementForm;
  setForm: (f: AnnouncementForm) => void;
}

export function AnnouncementsView({
  loading,
  search,
  setSearch,
  size,
  setSize,
  setPage,
  fetchAnnouncements,
  handleCreate,
  isAdmin,
  filtered,
  setLocation,
  totalPages,
  page,
  totalElements,
  isDialogOpen,
  setIsDialogOpen,
  handleSave,
  form,
  setForm,
}: AnnouncementsViewProps) {
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
            <RowsSelector
              value={size}
              onValueChange={(v) => {
                setSize(v);
                setPage(0);
              }}
              className="mr-2"
            />

            <Button
              variant="outline"
              size="icon"
              onClick={fetchAnnouncements}
              disabled={loading}
              className="h-11 w-11"
            >
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
            <div className="flex items-center justify-center h-40 opacity-50">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 opacity-40">
              <Megaphone className="h-10 w-10 mx-auto mb-2" />
              <p>No announcements found</p>
            </div>
          ) : (
            filtered.map((announcement) => (
              <Card
                key={announcement.id}
                onClick={() => setLocation(`/announcements/${announcement.id}`)}
                className="group cursor-pointer border-[#243F76]/10 dark:border-white/10 hover:shadow-md transition-all bg-white dark:bg-zinc-950"
              >
                <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <h3 className="font-bold text-lg text-[#1A2E56] dark:text-white leading-tight group-hover:text-primary transition-colors flex items-center flex-wrap gap-x-2">
                      <span>{announcement.title}</span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
                        {announcement.date}
                      </span>
                    </h3>
                    {announcement.details && (
                      <p className="text-xs text-muted-foreground line-clamp-1 opacity-70">
                        {announcement.details}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-[#243F76]/10">
            <div className="text-sm text-muted-foreground">
              Showing {page * size + 1}-{Math.min((page + 1) * size, totalElements)} of {totalElements} entries
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="border-[#243F76]/10"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="border-[#243F76]/10"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <AnnouncementDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        form={form}
        setForm={setForm}
        isEditing={false}
      />
    </MainLayout>
  );
}
