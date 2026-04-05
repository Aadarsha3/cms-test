import { Building2 } from "lucide-react";
import { PROGRAM_TYPES } from "@/lib/constants";

interface ProgramDetail {
  id: string;
  name: string;
  duration: string;
  programCode: string;
  type?: string;
}

interface ProgramInfoCardProps {
  program: ProgramDetail;
}

export function ProgramInfoCard({ program }: ProgramInfoCardProps) {
  return (
    <div className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-xl border border-border bg-card shadow-sm gap-4 transition-all hover:shadow-md">
      <div className="flex items-center gap-5 min-w-0">
        <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Building2 className="h-7 w-7 text-primary" />
        </div>
        <div className="flex flex-col min-w-0 gap-1">
          <h2 className="font-bold text-2xl text-foreground truncate">
            {program.name || "-"}
          </h2>
          <div className="flex items-center gap-3 flex-wrap font-medium text-muted-foreground/80">
            {program.programCode && (
              <>
                <span className="px-2 py-0.5 bg-muted rounded font-mono text-xs border border-border/50">
                  {program.programCode}
                </span>
                <span className="opacity-30">•</span>
              </>
            )}
            <span className="text-sm">
              {PROGRAM_TYPES.find((t) => t.value === program.type)?.label || program.type || "N/A Type"}
            </span>
            <span className="opacity-30">•</span>
            <span className="text-sm">
              {program.duration || "N/A Duration"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
