import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgramForm } from "@/components/program/ProgramForm";
import { PageHeader } from "@/components/common/PageHeader";
import { FormFooter } from "@/components/common/FormFooter";
import { Building2 } from "lucide-react";

interface FormData {
  name: string;
  code: string;
  type: string;
  duration: string;
}

interface CreateProgramViewProps {
  formData: FormData;
  loading: boolean;
  handleFieldChange: (field: keyof FormData, value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function CreateProgramView({
  formData,
  loading,
  handleFieldChange,
  handleSubmit,
  onCancel,
}: CreateProgramViewProps) {
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
                onCancel={onCancel}
                submitText="Create Program"
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
