import { TableCell, TableRow } from "@/components/ui/table";

interface TableEmptyStateProps {
  colSpan: number;
  error?: string | null;
  message?: string;
}

export function TableEmptyState({ 
  colSpan, 
  error, 
  message = "No matching records found." 
}: TableEmptyStateProps) {
  return (
    <TableRow>
      <TableCell
        colSpan={colSpan}
        className="h-24 text-center text-muted-foreground"
      >
        {error ? (
          <span className="text-destructive">
            Failed to load data.
          </span>
        ) : (
          message
        )}
      </TableCell>
    </TableRow>
  );
}
