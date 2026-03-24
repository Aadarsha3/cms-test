// pages/CreateProgramPage.tsx

import { useState } from "react";
import { useLocation } from "wouter";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { dashboardApi } from "@/lib/api";
import { ProgramForm } from "@/components/forms/ProgramForm";
import { extractErrorMessage, logError, validateRequiredFields } from "@/lib/error-handler";
import { ChevronLeft, Save, Loader2 } from "lucide-react";

interface FormData {
  name: string;
  code: string;
  type: string;
  duration: string;
}

export default function CreateProgramPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    code: "",
    type: "",
    duration: "",
  });

  const handleFieldChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    const validationError = validateRequiredFields({
      name: formData.name,
      code: formData.code,
      duration: formData.duration,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        duration: formData.duration,
        programCode: formData.code,
      };

      await dashboardApi.post("/programs", payload);

      toast({
        title: "Success",
        description: "Program created successfully.",
      });

      setLocation("/programs");
    } catch (err: any) {
      logError("CreateProgram", err);
      const errorMsg = extractErrorMessage(err, "Failed to create program.");

      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title="Create New Program">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/programs")}
            className="rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight text-[#243F76] dark:text-white">
            Program Details
          </h1>
        </div>

        <Card className="border-[#243F76]/10 dark:border-white/10 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-medium">New Program Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <ProgramForm
                data={formData}
                onChange={handleFieldChange}
                isLoading={loading}
              />

              <div className="flex justify-end gap-3 pt-4 border-t border-[#243F76]/10 dark:border-white/10">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/programs")}
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
                  Create Program
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
