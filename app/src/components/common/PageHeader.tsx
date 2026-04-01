import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useLocation } from "wouter";

interface PageHeaderProps {
  title: string;
  backUrl: string;
  icon?: React.ReactNode;
}

export function PageHeader({ title, backUrl, icon }: PageHeaderProps) {
  const [, setLocation] = useLocation();

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setLocation(backUrl)}
        className="rounded-full shrink-0"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <div className="flex items-center gap-3">
        {icon && (
          <div className="bg-[#243F76]/10 p-2 rounded-lg">
            {icon}
          </div>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-[#243F76] dark:text-white">
          {title}
        </h1>
      </div>
    </div>
  );
}
