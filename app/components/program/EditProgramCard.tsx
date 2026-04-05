import { ProgramForm } from "@/components/program/ProgramForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EditData {
  name: string;
  code: string;
  type: string;
  duration: string;
}

interface EditProgramCardProps {
  editData: EditData;
  onChange: (field: keyof EditData, value: string) => void;
  isLoading: boolean;
}

export function EditProgramCard({ editData, onChange, isLoading }: EditProgramCardProps) {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="bg-muted/40 border-b">
        <CardTitle className="text-lg">Edit Program Details</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <ProgramForm
          data={editData}
          onChange={onChange}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}
