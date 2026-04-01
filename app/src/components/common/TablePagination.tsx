import { Button } from "@/components/ui/button";

interface TablePaginationProps {
  page: number;
  size: number;
  itemsLength: number;
  totalElements: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  loading?: boolean;
}

export function TablePagination({
  page,
  size,
  itemsLength,
  totalElements,
  onPrevPage,
  onNextPage,
  loading = false,
}: TablePaginationProps) {
  if (loading || itemsLength === 0) return null;

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Showing {page * size + 1}-{page * size + itemsLength} of{" "}
        {totalElements} entries
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevPage}
          disabled={page === 0}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={itemsLength < size}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
