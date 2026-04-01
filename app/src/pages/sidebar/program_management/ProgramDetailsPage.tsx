// frontend/app/src/pages/sidebar/program_management/ProgramDetailsPage.tsx

import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { dashboardApi } from "@/lib/api";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ProgramForm } from "@/components/forms/ProgramForm";
import { ProgramDetailsView } from "@/components/program/ProgramDetailsView";
import { extractErrorMessage, logError, validateRequiredFields } from "@/lib/error-handler";
import { PROGRAM_TYPES } from "@/lib/constants";
import { ChevronLeft, Edit2, Save, Trash2, X, Loader2, Building2, BookOpen, ChevronRight, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/lib/auth-context";

interface ProgramDetail {
  id: string;
  name: string;
  duration: string;
  programCode: string;
  type?: string;
}

interface CourseDetail {
  id: string;
  name: string;
  courseCode: string;
  creditHour: string;
  program?: string;
}

interface EditData {
  name: string;
  code: string;
  type: string;
  duration: string;
}

export default function ProgramDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { hasPermission } = useAuth();

  const [program, setProgram] = useState<ProgramDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [editData, setEditData] = useState<EditData>({
    name: "",
    code: "",
    type: "",
    duration: "",
  });

  const [courses, setCourses] = useState<CourseDetail[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const fetchProgram = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dashboardApi.get<ProgramDetail>(`/programs/${id}`);
      setProgram(response.data);
      setEditData({
        name: response.data.name,
        code: response.data.programCode,
        type: response.data.type || "",
        duration: response.data.duration,
      });
    } catch (err: any) {
      logError("FetchProgram", err);
      const errorMsg = extractErrorMessage(err, "Failed to load program details");
      setError(errorMsg);
      toast({
        title: "Error fetching program",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProgramCourses = async () => {
    setLoadingCourses(true);
    try {
      const response = await dashboardApi.get(`/programs/${id}/courses`);
      const data = Array.isArray(response.data) ? response.data : (response.data as any)?.content || [];
      setCourses(data);
    } catch (err: any) {
      logError("FetchProgramCourses", err);
    } finally {
      setLoadingCourses(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProgram();
      fetchProgramCourses();
    }
  }, [id]);

  const handleEditFieldChange = (field: keyof EditData, value: string) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const validateEdit = (): boolean => {
    const validationError = validateRequiredFields({
      name: editData.name,
      code: editData.code,
      duration: editData.duration,
    });

    if (validationError) {
      toast({
        title: "Validation Error",
        description: validationError,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!program) return;

    if (
      editData.name === program.name &&
      editData.duration === program.duration &&
      editData.code === program.programCode &&
      editData.type === (program.type || "")
    ) {
      setIsEditing(false);
      return;
    }

    if (!validateEdit()) {
      return;
    }

    setIsSaving(true);
    try {
      const payload: { op: string; path: string; value: any }[] = [];

      if (editData.name !== program.name) {
        payload.push({ op: "replace", path: "/name", value: editData.name });
      }
      if (editData.duration !== program.duration) {
        payload.push({ op: "replace", path: "/duration", value: editData.duration });
      }
      if (editData.code !== program.programCode) {
        payload.push({ op: "replace", path: "/programCode", value: editData.code });
      }
      if (editData.type !== (program.type || "")) {
        payload.push({ op: "replace", path: "/type", value: editData.type });
      }

      if (payload.length > 0) {
        const response = await dashboardApi.patch(`/programs/${id}`, payload);
        const updatedProgram = response.data || {
          ...program,
          name: editData.name,
          programCode: editData.code,
          type: editData.type,
          duration: editData.duration,
        };
        setProgram(updatedProgram);
      }

      setIsEditing(false);
      toast({
        title: "Success",
        description: "Program details updated successfully.",
      });
    } catch (err: any) {
      logError("UpdateProgram", err);
      const errorMsg = extractErrorMessage(err, "Failed to update program.");
      toast({
        title: "Error updating program",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dashboardApi.delete(`/programs/${id}`);
      toast({
        title: "Program Deleted",
        description: "The program has been successfully deleted.",
      });
      setLocation("/programs");
    } catch (err: any) {
      logError("DeleteProgram", err);
      const errorMsg = extractErrorMessage(err, "Failed to delete the program.");
      toast({
        title: "Delete Failed",
        description: errorMsg,
        variant: "destructive",
      });
      setIsDeleting(false);
    }
  };

  const isAdmin = hasPermission("users_edit");

  if (loading) {
    return (
      <MainLayout title="Program Details">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-8 w-64" />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-72 mt-2" />
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (error || !program) {
    return (
      <MainLayout title="Program Details">
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg inline-block mb-4">
            {error || "Program not found."}
          </div>
          <div className="mt-4">
            <Button onClick={() => setLocation("/programs")} variant="outline">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Programs
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Program Details">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/programs")}
            className="rounded-full shrink-0"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Program Details
          </h1>
        </div>

        {isEditing ? (
          <Card className="border-[#243F76]/10 dark:border-white/10 shadow-sm overflow-hidden bg-card">
            <CardHeader className="bg-muted/40 pb-4 border-b border-border">
              <CardTitle className="text-lg font-medium">Edit Program</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ProgramForm
                data={editData}
                onChange={handleEditFieldChange}
                isLoading={isSaving}
              />
              <div className="flex items-center gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditData({
                      name: program.name,
                      code: program.programCode,
                      type: program.type || "",
                      duration: program.duration,
                    });
                  }}
                  disabled={isSaving}
                >
                  <X className="h-4 w-4 mr-2" /> Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-[#243F76] hover:bg-[#1a2e56] text-white"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border border-[#243F76]/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950 shadow-sm gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="h-12 w-12 rounded-md bg-[#243F76]/10 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                <Building2 className="h-6 w-6 text-[#243F76] dark:text-blue-400" />
              </div>
              <div className="flex flex-col min-w-0 gap-1.5">
                <h2 className="font-semibold text-lg text-foreground truncate">
                  {program.name || "-"}
                </h2>
                <div className="flex items-center gap-2 flex-wrap">
                  {program.programCode && (
                    <>
                      <span className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-900 rounded font-mono text-xs font-medium text-muted-foreground border dark:border-zinc-800">
                        {program.programCode}
                      </span>
                      <span className="text-muted-foreground/30 hidden sm:inline">•</span>
                    </>
                  )}
                  <span className="text-sm text-muted-foreground">
                    {PROGRAM_TYPES.find((t) => t.value === program.type)?.label || program.type || "N/A Type"}
                  </span>
                  <span className="text-muted-foreground/30 hidden sm:inline">•</span>
                  <span className="text-sm text-muted-foreground">
                    {program.duration || "N/A Duration"}
                  </span>
                </div>
              </div>
            </div>

            {isAdmin && (
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="gap-2 bg-transparent border-border hover:bg-zinc-100 dark:hover:bg-zinc-900"
                >
                  <Edit2 className="h-4 w-4" /> Edit
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="gap-2">
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the program
                        "{program.name}" ({program.programCode}) and all associated data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Trash2 className="h-4 w-4 mr-2" />
                        )}
                        Delete Program
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        )}

        <Card className="border-[#243F76]/10 dark:border-white/10 shadow-sm overflow-hidden bg-card">
          <CardHeader className="bg-muted/40 py-3 border-b border-border flex flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-muted-foreground shrink-0 mt-0" />
              <CardTitle className="text-lg font-medium mt-0">
                Program's Course List
              </CardTitle>
            </div>
            <Button size="sm" onClick={() => setLocation(`/courses/create?program=${id}`)} className="gap-2 shrink-0">
              <Plus className="h-4 w-4" /> 
              <span className="hidden sm:inline">Add Course</span>
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {loadingCourses ? (
                <div className="flex items-center justify-center h-24 text-muted-foreground border border-[#243F76]/10 dark:border-white/10 rounded-lg bg-zinc-50 dark:bg-zinc-950 shadow-sm">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Loading courses...
                </div>
              ) : courses.length === 0 ? (
                <div className="flex items-center justify-center h-24 text-muted-foreground border border-[#243F76]/10 dark:border-white/10 rounded-lg bg-zinc-50 dark:bg-zinc-950 shadow-sm">
                  No courses found for this program.
                </div>
              ) : (
                courses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => setLocation(`/courses/${course.id}`)}
                    className="group flex items-center justify-between p-3 rounded-lg border border-[#243F76]/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950 transition-all cursor-pointer shadow-sm hover:shadow-md gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-md bg-[#243F76]/10 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                        <BookOpen className="h-4 w-4 text-[#243F76] dark:text-blue-400" />
                      </div>
                      <div className="flex items-center gap-2 min-w-0 flex-wrap sm:flex-nowrap">
                        <h3 className="font-medium text-sm sm:text-base text-foreground truncate">
                          {course.name || "-"}
                        </h3>
                        <span className="text-muted-foreground/50 hidden sm:inline">•</span>
                        <div className="flex items-center gap-2 shrink-0">
                          {course.courseCode && (
                            <>
                              <span className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-900 rounded text-[10px] font-medium text-muted-foreground border dark:border-zinc-800">
                                {course.courseCode}
                              </span>
                              <span className="text-muted-foreground/50">•</span>
                            </>
                          )}
                          <span className="text-sm text-muted-foreground">
                            {course.creditHour || "0"} Credits
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center justify-center h-6 w-6 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
