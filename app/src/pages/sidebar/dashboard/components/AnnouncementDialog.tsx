// /app/src/pages/sidebar/dashboard/components/AnnouncementDialog.tsx

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AnnouncementForm } from "../types";

interface AnnouncementDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    form: AnnouncementForm;
    setForm: (form: AnnouncementForm) => void;
    isEditing: boolean;
}

export function AnnouncementDialog({
    isOpen,
    onClose,
    onSave,
    form,
    setForm,
    isEditing,
}: AnnouncementDialogProps) {


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Edit Announcement" : "New Announcement"}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            placeholder="Announcement title"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="details">Details</Label>
                        <Textarea
                            id="details"
                            placeholder="Announcement details..."
                            className="min-h-[200px]"
                            value={form.details}
                            onChange={(e) => setForm({ ...form, details: e.target.value })}
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0 border-t pt-4">
                    <Button variant="ghost" onClick={onClose}>
                        Discard
                    </Button>
                    <Button onClick={onSave} className="min-w-[120px]">
                        {isEditing ? "Update Post" : "Publish Now"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

