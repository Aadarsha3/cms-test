// pages/ProgramDetailsPage.tsx

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
import { ChevronLeft, Edit2, Save, Trash2, X, Loader2, Building2 } from "lucide-react";
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
import { useAuth } from "@/lib/auth-context";

interface ProgramDetail {
  id: string;
  name: string;
  duration: string;
  programCode: string;
  type?: string;
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

  useEffect(() => {
    if (id) {
      fetchProgram();
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/programs")}
              className="rounded-full shrink-0"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="bg-[#243F76]/10 dark:bg-zinc-800 p-2 rounded-lg">
                <Building2 className="h-5 w-5 text-[#243F76] dark:text-blue-400" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-[#243F76] dark:text-white">
                {program.name}
              </h1>
            </div>
          </div>

          {isAdmin && (
            <div className="flex items-center gap-2 self-end sm:self-auto">
              {!isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="gap-2"
                  >
                    <Edit2 className="h-4 w-4" /> Edit Program
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
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          )}
        </div>

        <Card className="border-[#243F76]/10 dark:border-white/10 shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/40 pb-4 border-b border-border">
            <CardTitle className="text-lg font-medium">Basic Information</CardTitle>
            <CardDescription>
              {isEditing ? "Update the program details below." : "View the program basics."}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {isEditing ? (
              <ProgramForm
                data={editData}
                onChange={handleEditFieldChange}
                isLoading={isSaving}
              />
            ) : (
              <ProgramDetailsView program={program} />
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
