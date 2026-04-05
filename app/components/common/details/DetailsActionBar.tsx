import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Save, Trash2, Loader2, X, type LucideIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface DetailsActionBarProps {
  backLabel?: string;
  onBack: () => void;
  canEdit?: boolean;
  isEditing: boolean;
  saving: boolean;
  onEdit: () => void;
  onSave: () => void;
  onDelete: () => void;
  onCancel: () => void;
  
  // Customization
  editLabel?: string;
  deleteLabel?: string;
  saveLabel?: string;
  cancelLabel?: string;
  editIcon?: LucideIcon;
  deleteIcon?: LucideIcon;
  
  // Confirmation
  confirmDelete?: {
    title: string;
    description: string;
  };
}

export function DetailsActionBar({
  backLabel = "Go Back",
  onBack,
  canEdit = true,
  isEditing,
  saving,
  onEdit,
  onSave,
  onDelete,
  onCancel,
  editLabel = "Edit",
  deleteLabel = "Delete",
  saveLabel = "Save Changes",
  cancelLabel = "Cancel",
  editIcon: EditIcon = Edit,
  deleteIcon: DeleteIcon = Trash2,
  confirmDelete,
}: DetailsActionBarProps): React.JSX.Element {
  
  const DeleteButton = (
    <Button
      variant="destructive"
      size="sm"
      className="gap-2 shadow-sm"
      onClick={confirmDelete ? undefined : onDelete}
    >
      <DeleteIcon className="h-4 w-4" /> {deleteLabel}
    </Button>
  );

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="gap-2 text-muted-foreground hover:text-foreground transition-colors self-start sm:self-auto"
      >
        <ArrowLeft className="h-4 w-4" /> {backLabel}
      </Button>

      {canEdit && (
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {isEditing ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancel}
                disabled={saving}
                className="gap-2"
              >
                <X className="h-4 w-4" /> {cancelLabel}
              </Button>
              <Button
                size="sm"
                onClick={onSave}
                disabled={saving}
                className="gap-2 shadow-sm bg-primary text-primary-foreground"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>{saveLabel}</span>
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="gap-2 shadow-sm"
              >
                <EditIcon className="h-4 w-4" /> {editLabel}
              </Button>
              
              {confirmDelete ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    {DeleteButton}
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{confirmDelete.title}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {confirmDelete.description}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={onDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {deleteLabel}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                DeleteButton
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

