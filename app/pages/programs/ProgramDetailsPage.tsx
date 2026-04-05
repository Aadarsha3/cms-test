import { useState, useEffect, useCallback } from "react";
import { useLocation, useParams } from "wouter";
import { dashboardApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { extractErrorMessage, logError, validateRequiredFields } from "@/lib/error-handler";
import { useAuth } from "@/lib/auth-context";
import { ProgramDetailsView } from "./ProgramDetailsView";

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
  
  const [courses, setCourses] = useState<CourseDetail[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const [editData, setEditData] = useState<EditData>({
    name: "",
    code: "",
    type: "",
    duration: "",
  });

  const fetchProgram = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!id) return;
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
      setError(extractErrorMessage(err, "Failed to load program details"));
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchProgramCourses = useCallback(async () => {
    if (!id) return;
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
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchProgram();
      fetchProgramCourses();
    }
  }, [id, fetchProgram, fetchProgramCourses]);

  const handleEditFieldChange = (field: keyof EditData, value: string) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!program || !id) return;
    const isUnchanged = editData.name === program.name && editData.duration === program.duration &&
                        editData.code === program.programCode && editData.type === (program.type || "");
    
    if (isUnchanged) return setIsEditing(false);

    const validationError = validateRequiredFields({ name: editData.name, code: editData.code, duration: editData.duration });
    if (validationError) return toast({ title: "Validation Error", description: validationError, variant: "destructive" });

    setIsSaving(true);
    try {
      const payload: { op: string; path: string; value: any }[] = [];
      if (editData.name !== program.name) payload.push({ op: "replace", path: "/name", value: editData.name });
      if (editData.duration !== program.duration) payload.push({ op: "replace", path: "/duration", value: editData.duration });
      if (editData.code !== program.programCode) payload.push({ op: "replace", path: "/programCode", value: editData.code });
      if (editData.type !== (program.type || "")) payload.push({ op: "replace", path: "/type", value: editData.type });

      if (payload.length > 0) {
        const response = await dashboardApi.patch(`/programs/${id}`, payload);
        setProgram(response.data || { ...program, ...editData, programCode: editData.code });
      }

      setIsEditing(false);
      toast({ title: "Success", description: "Program updated successfully." });
    } catch (err: any) {
      logError("UpdateProgram", err);
      toast({ title: "Error", description: extractErrorMessage(err, "Failed to update program."), variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await dashboardApi.delete(`/programs/${id}`);
      toast({ title: "Program Deleted", description: "The program has been successfully removed." });
      setLocation("/programs");
    } catch (err: any) {
      logError("DeleteProgram", err);
      toast({ title: "Delete Failed", description: extractErrorMessage(err, "Failed to delete."), variant: "destructive" });
    }
  };

  return (
    <ProgramDetailsView
      id={id || ""}
      program={program}
      loading={loading}
      error={error}
      isEditing={isEditing}
      isSaving={isSaving}
      courses={courses}
      loadingCourses={loadingCourses}
      editData={editData}
      handleEditFieldChange={handleEditFieldChange}
      handleSave={handleSave}
      handleDelete={handleDelete}
      setIsEditing={setIsEditing}
      setEditData={setEditData}
      hasPermission={hasPermission}
      setLocation={setLocation}
    />
  );
}

