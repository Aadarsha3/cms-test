import * as React from "react";
import { Search, RefreshCw, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RowsSelector } from "@/components/common/RowsSelector";
import { cn } from "@/lib/utils";

interface TableActionBarProps {
  search: string;
  setSearch: (value: string) => void;
  searchPlaceholder?: string;
  size: number;
  setSize: (value: number) => void;
  onRefresh: () => void;
  refreshing?: boolean;
  actionButton?: {
    label: string;
    icon?: React.ElementType;
    onClick: () => void;
    testId?: string;
    hidden?: boolean;
  };
  className?: string;
}

export function TableActionBar({
  search,
  setSearch,
  searchPlaceholder = "Search...",
  size,
  setSize,
  onRefresh,
  refreshing,
  actionButton,
  className,
}: TableActionBarProps) {
  const ActionIcon = actionButton?.icon || PlusCircle;

  return (
    <div className={cn("flex flex-col sm:flex-row gap-4 items-center justify-between", className)}>
      <div className="relative flex-1 w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id="table-search"
          name="table-search"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-11 bg-white dark:bg-zinc-950 border-border/50 shadow-sm transition-all focus-visible:ring-primary/20"
          autoComplete="off"
        />
      </div>

      <div className="flex items-center gap-2">
        <RowsSelector
          value={size}
          onValueChange={setSize}
        />

        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          className="h-11 w-11 shrink-0 hover:bg-muted"
          title="Refresh List"
          disabled={refreshing}
        >
          <RefreshCw
            className={cn("h-4 w-4 transition-all", refreshing && "animate-spin")}
          />
        </Button>
        
        {actionButton && !actionButton.hidden && (
          <Button
            onClick={actionButton.onClick}
            className="gap-2 h-11 px-6 shadow-md hover:shadow-lg transition-all active:scale-95"
            data-testid={actionButton.testId}
          >
            <ActionIcon className="h-4 w-4" />
            <span className="hidden sm:inline">{actionButton.label}</span>
            <span className="sm:hidden">
              {actionButton.label.split(" ")[0]}
            </span>
          </Button>
        )}
      </div>
    </div>
  );
}
