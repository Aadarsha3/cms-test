import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { dashboardApi } from "@/lib/api";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

import { DetailsLoading } from "@/components/common/details/DetailsLoading";
import { DetailsError } from "@/components/common/details/DetailsError";
import { DetailsActionBar } from "@/components/common/details/DetailsActionBar";

interface CourseDetail {
  id: string;
  name: string;
  courseCode: string;
  creditHour: string;
  program?: string;
}

export default function CourseDetailsPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { hasPermission } = useAuth();

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [editData, setEditData] = useState<Partial<CourseDetail>>({});

  const fetchCourse = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dashboardApi.get<CourseDetail>(`/courses/${id}`);
      setCourse(response.data);
      setEditData(response.data);
    } catch (err: any) {
      console.error("Failed to fetch course:", err);
      setError(err.message || "Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCourse();
    }
  }, [id]);

  const handleEditChange = (field: keyof CourseDetail, value: any) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (
      editData.name === course?.name &&
      editData.courseCode === course?.courseCode &&
      editData.creditHour === course?.creditHour
    ) {
      setIsEditing(false);
      return;
    }

    if (!editData.name || !editData.courseCode || !editData.creditHour) {
      toast({
        title: "Validation Error",
        description: "Name, Code, and Credit Hours are required.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const payload: { op: string; path: string; value: any }[] = [];

      if (editData.name !== course?.name) {
        payload.push({ op: "replace", path: "/name", value: editData.name });
      }
      if (editData.courseCode !== course?.courseCode) {
        payload.push({ op: "replace", path: "/courseCode", value: editData.courseCode });
      }
      if (editData.creditHour !== course?.creditHour) {
        payload.push({ op: "replace", path: "/creditHour", value: editData.creditHour });
      }

      const response = await dashboardApi.patch(`/courses/${id}`, payload);
      setCourse(response.data || { ...course, ...editData } as CourseDetail);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Course details updated successfully.",
      });
    } catch (err: any) {
      console.error("Failed to update course:", err);
      toast({
        title: "Error updating course",
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
      await dashboardApi.delete(`/courses/${id}`, { data: {} });
      toast({
        title: "Course Deleted",
        description: "The course has been successfully deleted.",
      });
      setLocation(course?.program ? `/programs/${course.program}` : "/programs");
    } catch (err: any) {
      console.error("Failed to delete course:", err);
      toast({
        title: "Delete Failed",
        description: err.response?.data?.message || "Failed to delete the course.",
        variant: "destructive",
      });
      setIsDeleting(false);
    }
  };

  const isAdmin = hasPermission("users_edit");
  const backUrl = course?.program ? `/programs/${course.program}` : "/programs";

  if (loading) return <DetailsLoading title="Course Details" />;

  if (error || !course) {
    return (
      <DetailsError 
        title="Course Details" 
        error={error || "Course not found."} 
        backLabel="Go Back"
        onBack={() => setLocation(backUrl)} 
      />
    );
  }

  return (
    <MainLayout title="Course Details">
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        <DetailsActionBar
          onBack={() => setLocation(backUrl)}
          canEdit={isAdmin}
          isEditing={isEditing}
          saving={isSaving}
          onEdit={() => {
            setEditData(course);
            setIsEditing(true);
          }}
          onSave={handleSave}
          onDelete={handleDelete}
          onCancel={() => {
            setIsEditing(false);
            setEditData(course);
          }}
          editLabel="Edit Course"
          deleteLabel="Delete Course"
          confirmDelete={{
            title: "Are you absolutely sure?",
            description: `This will permanently delete "${course.name}" (${course.courseCode}) and associated records.`
          }}
        />

        <div className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-xl border border-border bg-card shadow-sm gap-4 transition-all hover:shadow-md">
          <div className="flex items-center gap-5 min-w-0">
            <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <BookOpen className="h-7 w-7 text-primary" />
            </div>
            <div className="flex flex-col min-w-0 gap-1">
              <h2 className="font-bold text-2xl text-foreground truncate">
                {course.name || "-"}
              </h2>
              <div className="flex items-center gap-3 flex-wrap font-medium text-muted-foreground/80">
                {course.courseCode && (
                  <>
                    <span className="px-2 py-0.5 bg-muted rounded font-mono text-xs border border-border/50">
                      {course.courseCode}
                    </span>
                    <span className="opacity-30">•</span>
                  </>
                )}
                <span className="text-sm">
                  {course.creditHour || "0"} Credits
                </span>
              </div>
            </div>
          </div>
        </div>

        <Card className="border-border shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/40 pb-4 border-b">
            <CardTitle className="text-lg">Basic Information</CardTitle>
            <CardDescription>View or manage the key details of this course curriculum.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2.5">
                <Label htmlFor="courseName" className="text-sm font-semibold text-muted-foreground ml-1">
                  Course Name
                </Label>
                {isEditing ? (
                  <Input
                    id="courseName"
                    value={editData.name || ""}
                    onChange={(e) => handleEditChange("name", e.target.value)}
                    className="h-11"
                  />
                ) : (
                  <div className="font-semibold text-lg px-4 py-2.5 bg-muted/30 border border-border/50 rounded-xl min-h-12 flex items-center">
                    {course.name || "-"}
                  </div>
                )}
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="courseCode" className="text-sm font-semibold text-muted-foreground ml-1">
                  Course Code
                </Label>
                {isEditing ? (
                  <Input
                    id="courseCode"
                    value={editData.courseCode || ""}
                    onChange={(e) => handleEditChange("courseCode", e.target.value)}
                    className="h-11"
                  />
                ) : (
                  <div className="font-mono text-base px-4 py-2.5 bg-muted/30 border border-border/50 rounded-xl min-h-12 flex items-center">
                    {course.courseCode || "-"}
                  </div>
                )}
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="creditHours" className="text-sm font-semibold text-muted-foreground ml-1">
                  Credit Hours
                </Label>
                {isEditing ? (
                  <Input
                    id="creditHours"
                    type="number"
                    value={editData.creditHour || ""}
                    onChange={(e) => handleEditChange("creditHour", e.target.value)}
                    className="h-11"
                  />
                ) : (
                  <div className="font-semibold text-lg px-4 py-2.5 bg-muted/30 border border-border/50 rounded-xl min-h-12 flex items-center">
                    {course.creditHour || "0"} Credits
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

