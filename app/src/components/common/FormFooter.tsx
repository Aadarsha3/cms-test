import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";

interface FormFooterProps {
  loading: boolean;
  onCancel: () => void;
  submitText?: string;
  cancelText?: string;
}

export function FormFooter({
  loading,
  onCancel,
  submitText = "Save",
  cancelText = "Cancel",
}: FormFooterProps) {
  return (
    <div className="flex justify-end gap-3 pt-4 border-t border-[#243F76]/10 dark:border-white/10">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={loading}
      >
        {cancelText}
      </Button>
      <Button
        type="submit"
        disabled={loading}
        className="bg-[#243F76] hover:bg-[#1a2e56] text-white gap-2"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        {submitText}
      </Button>
    </div>
  );
}
