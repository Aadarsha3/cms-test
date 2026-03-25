// components/program/ProgramDetailsView.tsx

import { Label } from "@/components/ui/label";
import { PROGRAM_TYPES } from "@/lib/constants";

interface ProgramDetail {
  id: string;
  name: string;
  duration: string;
  programCode: string;
  type?: string;
}

interface ProgramDetailsViewProps {
  program: ProgramDetail;
}

export function ProgramDetailsView({ program }: ProgramDetailsViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="programName" className="text-muted-foreground">
          Program Name
        </Label>
        <div className="font-medium text-base p-2 bg-muted/20 border border-transparent rounded-md min-h-10 flex items-center">
          {program.name || "-"}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="programCode" className="text-muted-foreground">
          Program Code
        </Label>
        <div className="font-medium text-base p-2 bg-muted/20 border border-transparent rounded-md min-h-10 flex items-center">
          <div className="px-2 py-1 bg-zinc-200 dark:bg-zinc-800 rounded font-mono text-sm inline-block">
            {program.programCode || "-"}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="programType" className="text-muted-foreground">
          Program Type
        </Label>
        <div className="font-medium text-base p-2 bg-muted/20 border border-transparent rounded-md min-h-10 flex items-center">
          {PROGRAM_TYPES.find((t) => t.value === program.type)?.label || program.type || "-"}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="programDuration" className="text-muted-foreground">
          Duration
        </Label>
        <div className="font-medium text-base p-2 bg-muted/20 border border-transparent rounded-md min-h-10 flex items-center">
          {program.duration || "-"}
        </div>
      </div>
    </div>
  );
}
