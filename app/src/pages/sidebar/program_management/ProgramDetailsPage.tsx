import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { dashboardApi } from "@/lib/api";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
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
  
  const [editData, setEditData] = useState<Partial<ProgramDetail>>({});

  const durationOptions = [
    { label: "1 Year", value: "1 year" },
    { label: "2 Years", value: "2 year" },
    { label: "3 Years", value: "3 year" },
    { label: "4 Years", value: "4 year" },
    { label: "5 Years", value: "5 year" },
    { label: "6 Years", value: "6 year" },
    { label: "2 Semesters", value: "2 sem" },
    { label: "4 Semesters", value: "4 sem" },
    { label: "6 Semesters", value: "6 sem" },
    { label: "8 Semesters", value: "8 sem" },
  ];

  const fetchProgram = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dashboardApi.get<ProgramDetail>(`/programs/${id}`);
      setProgram(response.data);
      setEditData(response.data);
    } catch (err: any) {
      console.error("Failed to fetch program:", err);
      setError(err.message || "Failed to load program details");
      toast({
        title: "Error fetching program",
        description: err.response?.data?.message || err.message,
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

  const handleEditChange = (field: keyof ProgramDetail, value: string) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (
      editData.name === program?.name &&
      editData.duration === program?.duration &&
      editData.programCode === program?.programCode
    ) {
      setIsEditing(false);
      return;
    }

    if (!editData.name || !editData.programCode || !editData.duration) {
      toast({
        title: "Validation Error",
        description: "All fields are required.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const payload: { op: string; path: string; value: any }[] = [];
      
      if (editData.name !== program?.name) {
        payload.push({ op: "replace", path: "/name", value: editData.name });
      }
      if (editData.duration !== program?.duration) {
        payload.push({ op: "replace", path: "/duration", value: editData.duration });
      }
      if (editData.programCode !== program?.programCode) {
        payload.push({ op: "replace", path: "/programCode", value: editData.programCode });
      }

      const response = await dashboardApi.patch(`/programs/${id}`, payload);
      setProgram(response.data || { ...program, ...editData } as ProgramDetail);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Program details updated successfully.",
      });
    } catch (err: any) {
      console.error("Failed to update program:", err);
      toast({
        title: "Error updating program",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dashboardApi.delete(`/programs/${id}`, { data: {} });
      toast({
        title: "Program Deleted",
        description: "The program has been successfully deleted.",
      });
      setLocation("/programs");
    } catch (err: any) {
      console.error("Failed to delete program:", err);
      toast({
        title: "Delete Failed",
        description: err.response?.data?.message || "Failed to delete the program.",
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
            <CardContent className="p-6">
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
                    onClick={() => {
                      setEditData(program);
                      setIsEditing(true);
                    }}
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
                          "{program.name}" ({program.programCode}) and remote data from our servers.
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
                      setEditData(program);
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
            <CardDescription>View or manage the program basics.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="programName" className="text-muted-foreground">
                  Program Name
                </Label>
                {isEditing ? (
                  <Input
                    id="programName"
                    value={editData.name || ""}
                    onChange={(e) => handleEditChange("name", e.target.value)}
                  />
                ) : (
                  <div className="font-medium text-base p-2 bg-muted/20 border border-transparent rounded-md min-h-10 flex items-center">
                    {program.name || "-"}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="programCode" className="text-muted-foreground">
                  Program Code
                </Label>
                {isEditing ? (
                  <Input
                    id="programCode"
                    value={editData.programCode || ""}
                    onChange={(e) => handleEditChange("programCode", e.target.value)}
                  />
                ) : (
                  <div className="font-medium text-base p-2 bg-muted/20 border border-transparent rounded-md min-h-10 flex items-center">
                    <div className="px-2 py-1 bg-zinc-200 dark:bg-zinc-800 rounded font-mono text-sm inline-block">
                      {program.programCode || "-"}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="programDuration" className="text-muted-foreground">
                  Duration
                </Label>
                {isEditing ? (
                  <Select
                    value={editData.duration || ""}
                    onValueChange={(value) => handleEditChange("duration", value)}
                  >
                    <SelectTrigger id="programDuration">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {durationOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="font-medium text-base p-2 bg-muted/20 border border-transparent rounded-md min-h-10 flex items-center">
                    {program.duration || "-"}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
