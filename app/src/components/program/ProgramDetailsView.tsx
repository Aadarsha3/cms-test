// components/program/ProgramDetailsView.tsx

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-7 gap-x-8">
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-muted-foreground">Program Name</p>
        <p className="text-base font-semibold text-foreground">
          {program.name || "-"}
        </p>
      </div>

      <div className="space-y-1.5">
        <p className="text-sm font-medium text-muted-foreground">Program Code</p>
        <div>
          {program.programCode ? (
            <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded font-mono text-sm text-muted-foreground border dark:border-zinc-700/50">
              {program.programCode}
            </span>
          ) : (
            <span className="text-base font-semibold text-foreground">-</span>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-sm font-medium text-muted-foreground">Program Type</p>
        <p className="text-base font-semibold text-foreground capitalize">
          {PROGRAM_TYPES.find((t) => t.value === program.type)?.label || program.type || "-"}
        </p>
      </div>

      <div className="space-y-1.5">
        <p className="text-sm font-medium text-muted-foreground">Duration</p>
        <p className="text-base font-semibold text-foreground">
          {program.duration || "-"}
        </p>
      </div>
    </div>
  );
}
