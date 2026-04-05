import { MainLayout } from "@/components/layout/MainLayout";
import { Loader2 } from "lucide-react";

interface DetailsLoadingProps {
  title: string;
}

export function DetailsLoading({ title }: DetailsLoadingProps) {
  return (
    <MainLayout title={title}>
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    </MainLayout>
  );
}
