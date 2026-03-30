// /app/src/pages/sidebar/course_management/CreateCoursePage.tsx

import { useState } from "react";
import { useLocation } from "wouter";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { dashboardApi } from "@/lib/api";
import { ChevronLeft, Save, Loader2, BookOpen } from "lucide-react";

interface FormData {
  name: string;
  courseCode: string;
  creditHour: string;
}

export default function CreateCoursePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    courseCode: "",
    creditHour: "3",
  });

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Course name is required",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.courseCode.trim()) {
      toast({
        title: "Validation Error",
        description: "Course code is required",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.creditHour || Number(formData.creditHour) < 1) {
      toast({
        title: "Validation Error",
        description: "Credit hours must be at least 1",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        courseCode: formData.courseCode.trim(),
        creditHour: formData.creditHour,
        program: "",
      };

      const response = await dashboardApi.post("/courses", payload);

      toast({
        title: "Success",
        description: "Course created successfully.",
      });

      if (response.data?.id) {
        setLocation(`/courses/${response.data.id}`);
      } else {
        setLocation("/courses");
      }
    } catch (err: any) {
      console.error("Failed to create course:", err?.response?.data || err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to create course.";

      toast({
        title: "Error",
        description: typeof errorMsg === 'string' ? errorMsg : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title="Create New Course">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/courses")}
            className="rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="bg-[#243F76]/10 p-2 rounded-lg">
              <BookOpen className="h-6 w-6 text-[#243F76]" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#243F76] dark:text-white">
              Course Details
            </h1>
          </div>
        </div>

        <Card className="border-[#243F76]/10 dark:border-white/10 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-medium">New Course Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="course-name">
                      Course Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="course-name"
                      placeholder="e.g. Advanced Mathematics"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="course-code">
                      Course Code <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="course-code"
                      placeholder="e.g. MATH301"
                      value={formData.courseCode}
                      onChange={(e) =>
                        setFormData({ ...formData, courseCode: e.target.value })
                      }
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="credit-hours">
                    Credit Hours <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="credit-hours"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.creditHour}
                    onChange={(e) =>
                      setFormData({ ...formData, creditHour: e.target.value })
                    }
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#243F76]/10 dark:border-white/10">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/courses")}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[#243F76] hover:bg-[#1a2e56] text-white gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Create Course
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
