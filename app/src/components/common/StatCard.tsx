import { type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  testId?: string;
}

export function StatCard({ title, value, icon: Icon, trend, testId }: StatCardProps) {
  return (
    <Card
      data-testid={testId}
      className="group hover:shadow-md transition-all duration-300 border-[#243F76]/10 dark:border-white/10 hover:border-[#106bc6]/30 dark:hover:border-[#106bc6]/30"
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex flex-col gap-0.5 sm:gap-1">
            <span className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</span>
            <span className="text-lg sm:text-2xl font-bold text-[#1A2E56] dark:text-white">{value}</span>
            {trend && (
              <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1">
                <span
                  className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full ${trend.value >= 0
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-destructive/10 text-destructive"
                    }`}
                >
                  {trend.value >= 0 ? "+" : ""}
                  {trend.value}%
                </span>
                <span className="text-[9px] sm:text-[10px] text-muted-foreground font-medium">{trend.label}</span>
              </div>
            )}
          </div>
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-[#106bc6]/10 text-[#106bc6] group-hover:bg-[#106bc6] group-hover:text-white transition-all duration-300 shadow-sm shrink-0 mr-[5px] sm:mr-0">
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
