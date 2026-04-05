import { useState } from "react";
import { useLocation } from "wouter";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { dashboardApi } from "@/lib/api";
import { ProgramForm } from "@/components/program/ProgramForm";
import { extractErrorMessage, logError, validateRequiredFields } from "@/lib/error-handler";
import { PageHeader } from "@/components/common/PageHeader";
import { FormFooter } from "@/components/common/FormFooter";
import { Building2 } from "lucide-react";

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
        type: formData.type,
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
        <PageHeader
          title="Program Details"
          backUrl="/programs"
          icon={<Building2 className="h-6 w-6 text-[#243F76]" />}
        />

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

              <FormFooter
                loading={loading}
                onCancel={() => setLocation("/programs")}
                submitText="Create Program"
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
