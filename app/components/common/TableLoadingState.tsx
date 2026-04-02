import { TableCell, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";

interface TableLoadingStateProps {
  colSpan: number;
  message?: string;
}

export function TableLoadingState({ colSpan, message = "Loading..." }: TableLoadingStateProps) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-24 text-center">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          {message}
        </div>
      </TableCell>
    </TableRow>
  );
}
