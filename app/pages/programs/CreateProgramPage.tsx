import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { dashboardApi } from "@/lib/api";
import { extractErrorMessage, logError, validateRequiredFields } from "@/lib/error-handler";
import { CreateProgramView } from "./CreateProgramView";

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
    <CreateProgramView
      formData={formData}
      loading={loading}
      handleFieldChange={handleFieldChange}
      handleSubmit={handleSubmit}
      onCancel={() => setLocation("/programs")}
    />
  );
}
