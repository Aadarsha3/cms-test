import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";

interface DetailsErrorProps {
  title: string;
  error: string;
  backLabel: string;
  onBack: () => void;
}

export function DetailsError({ title, error, backLabel, onBack }: DetailsErrorProps) {
  return (
    <MainLayout title={title}>
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={onBack}>{backLabel}</Button>
      </div>
    </MainLayout>
  );
}
