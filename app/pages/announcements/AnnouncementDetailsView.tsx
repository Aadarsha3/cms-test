import React from "react";
import {
  ChevronLeft,
  Calendar,
  Edit2,
  Trash2,
  Loader2,
  X,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MainLayout } from "@/components/layout/MainLayout";
import { Announcement } from "../dashboard/types";

interface AnnouncementDetailsViewProps {
  announcement: Announcement | null;
  loading: boolean;
  isEditing: boolean;
  isSaving: boolean;
  editForm: { title: string; details: string };
  setEditForm: (form: { title: string; details: string }) => void;
  setIsEditing: (editing: boolean) => void;
  handleSave: () => void;
  handleDelete: () => void;
  isAdmin: boolean;
  setLocation: (loc: string) => void;
}

export function AnnouncementDetailsView({
  announcement,
  loading,
  isEditing,
  isSaving,
  editForm,
  setEditForm,
  setIsEditing,
  handleSave,
  handleDelete,
  isAdmin,
  setLocation,
}: AnnouncementDetailsViewProps) {
  if (loading) {
    return (
      <MainLayout title="Notice Details">
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-10 w-32" />
          <Card className="border-[#243F76]/10 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/40 pb-8 border-b">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            </CardHeader>
            <CardContent className="pt-8 space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (!announcement) return <div className="p-20 text-center">Announcement not found</div>;

  return (
    <MainLayout title="Notice Details">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/announcements")}
            className="rounded-full shrink-0 group px-0 border-none bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-900 pr-4"
          >
            <ChevronLeft className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to List
          </Button>

          {isAdmin && !isEditing && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="gap-2 border-[#243F76]/20"
              >
                <Edit2 className="h-4 w-4" /> Edit
              </Button>
              <Button variant="destructive" onClick={handleDelete} className="gap-2">
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            </div>
          )}
        </div>

        <Card className="border-[#243F76]/10 dark:border-white/10 shadow-lg overflow-hidden bg-white dark:bg-zinc-950">
          {isEditing ? (
            <div className="p-8 space-y-6">
              <h2 className="text-xl font-bold mb-4">Edit Announcement</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="h-12 border-[#243F76]/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="details">Details</Label>
                  <Textarea
                    id="details"
                    value={editForm.details}
                    onChange={(e) => setEditForm({ ...editForm, details: e.target.value })}
                    className="min-h-[300px] border-[#243F76]/10"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm({ title: announcement.title, details: announcement.details || "" });
                  }}
                >
                  <X className="h-4 w-4 mr-2" /> Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-[#243F76] hover:bg-[#1a2e56] text-white px-8"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <>
              <CardHeader className="bg-[#243F76]/5 dark:bg-zinc-900/50 pb-8 pt-10 px-8 border-b border-[#243F76]/10">
                <CardTitle className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#1A2E56] dark:text-white mb-2 leading-tight">
                  {announcement.title}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-6 mt-6 text-sm text-[#243F76]/60 dark:text-gray-400 font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#243F76]" />
                    {announcement.date}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 pt-10">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-line">
                    {announcement.details || "No content provided."}
                  </p>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </MainLayout>
  );
}
