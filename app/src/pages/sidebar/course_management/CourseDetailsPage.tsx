// /app/src/pages/sidebar/course_management/CourseDetailsPage.tsx

import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { dashboardApi } from "@/lib/api";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Edit2, Save, Trash2, X, Loader2, BookOpen } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth-context";

interface Program {
  id: string;
  name: string;
}

interface CourseDetail {
  id: string;
  name: string;
  courseCode: string;
  creditHour: string;
  program?: string;
}

export default function CourseDetailsPage() {
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
      toast({
        title: "Error fetching course",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
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
      setLocation("/courses");
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

  if (loading) {
    return (
      <MainLayout title="Course Details">
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

  if (error || !course) {
    return (
      <MainLayout title="Course Details">
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg inline-block mb-4">
            {error || "Course not found."}
          </div>
          <div className="mt-4">
            <Button onClick={() => setLocation("/courses")} variant="outline">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Courses
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Course Details">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/courses")}
              className="rounded-full shrink-0"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="bg-[#243F76]/10 dark:bg-zinc-800 p-2 rounded-lg">
                <BookOpen className="h-5 w-5 text-[#243F76] dark:text-blue-400" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-[#243F76] dark:text-white">
                {course.name}
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
                      setEditData(course);
                      setIsEditing(true);
                    }}
                    className="gap-2"
                  >
                    <Edit2 className="h-4 w-4" /> Edit Course
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
                          This action cannot be undone. This will permanently delete the course
                          "{course.name}" ({course.courseCode}) and remote data from our servers.
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
                          Delete Course
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
                      setEditData(course);
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
            <CardDescription>View or manage the course basics.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="space-y-2">
                <Label htmlFor="courseName" className="text-muted-foreground">
                  Course Name
                </Label>
                {isEditing ? (
                  <Input
                    id="courseName"
                    value={editData.name || ""}
                    onChange={(e) => handleEditChange("name", e.target.value)}
                  />
                ) : (
                  <div className="font-medium text-base p-2 bg-muted/20 border border-transparent rounded-md min-h-10 flex items-center">
                    {course.name || "-"}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="courseCode" className="text-muted-foreground">
                  Course Code
                </Label>
                {isEditing ? (
                  <Input
                    id="courseCode"
                    value={editData.courseCode || ""}
                    onChange={(e) => handleEditChange("courseCode", e.target.value)}
                  />
                ) : (
                  <div className="font-medium text-base p-2 bg-muted/20 border border-transparent rounded-md min-h-10 flex items-center">
                    <div className="px-2 py-1 bg-zinc-200 dark:bg-zinc-800 rounded font-mono text-sm inline-block">
                      {course.courseCode || "-"}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="creditHours" className="text-muted-foreground">
                  Credit Hours
                </Label>
                {isEditing ? (
                  <Input
                    id="creditHours"
                    type="number"
                    value={editData.creditHour || ""}
                    onChange={(e) => handleEditChange("creditHour", e.target.value)}
                  />
                ) : (
                  <div className="font-medium text-base p-2 bg-muted/20 border border-transparent rounded-md min-h-10 flex items-center">
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
