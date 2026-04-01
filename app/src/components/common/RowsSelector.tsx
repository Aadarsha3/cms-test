// /app/src/components/common/RowsSelector.tsx

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RowsSelectorProps {
  value: number;
  onValueChange: (value: number) => void;
  options?: number[];
  className?: string;
}

export function RowsSelector({ 
  value, 
  onValueChange, 
  options = [5, 10, 20, 50],
  className 
}: RowsSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground hidden lg:inline">
        Rows:
      </span>
      <Select
        value={String(value)}
        onValueChange={(v) => onValueChange(Number(v))}
      >
        <SelectTrigger className={`h-11 w-[85px] bg-white dark:bg-zinc-950 border-[#243F76]/10 dark:border-white/10 shadow-sm ${className}`}>
          <SelectValue placeholder={String(value)} />
        </SelectTrigger>
        <SelectContent>
          {options.map((v) => (
            <SelectItem key={v} value={String(v)}>
              {v}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
