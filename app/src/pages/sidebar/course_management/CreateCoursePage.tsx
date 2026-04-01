// /app/src/pages/sidebar/course_management/CreateCoursePage.tsx

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { dashboardApi } from "@/lib/api";
import { PageHeader } from "@/components/common/PageHeader";
import { FormFooter } from "@/components/common/FormFooter";
import { BookOpen } from "lucide-react";

interface Program {
  id: string;
  name: string;
}

interface FormData {
  name: string;
  courseCode: string;
  creditHour: string;
  program: string;
}

export default function CreateCoursePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [programs, setPrograms] = useState<Program[]>([]);
  const [fetchingPrograms, setFetchingPrograms] = useState(true);

  const [formData, setFormData] = useState<FormData>(() => {
    let defaultProgram = "";
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      defaultProgram = params.get("program") || "";
    }
    return {
      name: "",
      courseCode: "",
      creditHour: "3",
      program: defaultProgram,
    };
  });

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await dashboardApi.get("/programs");
        const data = Array.isArray(response.data) ? response.data :
          (response.data as any)?.content || [];
        setPrograms(data);
      } catch (err) {
        console.error("Failed to fetch programs:", err);
        toast({
          title: "Error",
          description: "Failed to load programs",
          variant: "destructive",
        });
      } finally {
        setFetchingPrograms(false);
      }
    };
    fetchPrograms();
  }, [toast]);

  // ✅ Fixed: Validate all required fields
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

    // ✅ Fixed: Require program selection
    if (!formData.program) {
      toast({
        title: "Validation Error",
        description: "Please select an academic program",
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
        program: formData.program, // ✅ This is now the program ID
      };

      const response = await dashboardApi.post("/courses", payload);

      toast({
        title: "Success",
        description: "Course created successfully.",
      });

      // ✅ Redirect to the new course details page
      if (response.data?.id) {
        setLocation(`/courses/${response.data.id}`, { replace: true });
      } else {
        setLocation("/courses", { replace: true });
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
        <PageHeader 
          title="Course Details"
          backUrl="/courses"
          icon={<BookOpen className="h-6 w-6 text-[#243F76]" />}
        />

        <Card className="border-[#243F76]/10 dark:border-white/10 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-medium">New Course Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* ✅ Fixed: Program field now shows required indicator */}
                <div className="space-y-2">
                  <Label htmlFor="program-id">
                    Academic Program <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.program}
                    onValueChange={(v) => setFormData({ ...formData, program: v })}
                    disabled={fetchingPrograms || loading}
                  >
                    <SelectTrigger id="program-id">
                      <SelectValue
                        placeholder={
                          fetchingPrograms
                            ? "Loading programs..."
                            : programs.length === 0
                              ? "No programs available"
                              : "Select program"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {programs.length > 0 ? (
                        programs.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          {fetchingPrograms ? "Loading..." : "No programs found"}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {programs.length === 0 && !fetchingPrograms && (
                    <p className="text-xs text-muted-foreground">
                      ⚠️ No programs found. Please create a program first.
                    </p>
                  )}
                </div>

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

              <FormFooter
                loading={loading || fetchingPrograms}
                onCancel={() => setLocation("/courses")}
                submitText="Create Course"
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}