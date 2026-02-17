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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

import { AnnouncementForm } from "../types";
import {
    availableRoles,
    availableDepartments,
    availablePrograms,
    availableGroups,
    departmentPrograms,
} from "../constants";

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

    const toggleItem = (field: keyof AnnouncementForm, id: string) => {
        const current = (form[field] as string[]) || [];

        if (id === "all") {
            setForm({ ...form, [field]: ["all"] });
            return;
        }

        let next = current.filter((item) => item !== "all");
        if (next.includes(id)) {
            next = next.filter((item) => item !== id);
            // Fallback to "all" if empty
            if (next.length === 0) next = ["all"];
        } else {
            next.push(id);
        }

        setForm({ ...form, [field]: next });
    };

    const handleDeptToggle = (deptId: string) => {
        const currentDepts = form.targetDepartments || [];

        if (deptId === "all") {
            setForm({
                ...form,
                targetDepartments: ["all"],
                targetPrograms: ["all"],
            });
            return;
        }

        let nextDepts = currentDepts.filter((d) => d !== "all");
        if (nextDepts.includes(deptId)) {
            nextDepts = nextDepts.filter((d) => d !== deptId);
        } else {
            nextDepts.push(deptId);
        }

        if (nextDepts.length === 0) {
            setForm({ ...form, targetDepartments: ["all"], targetPrograms: ["all"] });
        } else {
            // Sync programs: only keep those belonging to selected departments
            const allowedPrograms = nextDepts.flatMap((d) => departmentPrograms[d] || []);
            const nextPrograms = form.targetPrograms.filter(
                (p) => p === "all" || allowedPrograms.includes(p)
            );

            setForm({
                ...form,
                targetDepartments: nextDepts,
                targetPrograms: nextPrograms.length > 0 ? nextPrograms : ["all"],
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Edit Announcement" : "New Announcement"}
                    </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="content" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="content">Content</TabsTrigger>
                        <TabsTrigger value="targeting">Audience</TabsTrigger>
                    </TabsList>

                    <TabsContent value="content" className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Headline</Label>
                            <Input
                                id="title"
                                placeholder="Brief summary of the announcement"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="content">Full Description</Label>
                            <Textarea
                                id="content"
                                placeholder="Provide more context here..."
                                className="min-h-[160px]"
                                value={form.content}
                                onChange={(e) => setForm({ ...form, content: e.target.value })}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="targeting" className="space-y-6 py-4">
                        <div className="flex items-center space-x-3 bg-muted/20 p-4 rounded-lg border border-dashed">
                            <Checkbox
                                id="isEveryone"
                                checked={form.isEveryone}
                                onCheckedChange={(checked) =>
                                    setForm({ ...form, isEveryone: !!checked })
                                }
                            />
                            <div className="grid gap-1.5 leading-none">
                                <Label htmlFor="isEveryone" className="text-sm font-semibold cursor-pointer">
                                    Public Broadcast
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    This announcement will be visible to all users across the platform.
                                </p>
                            </div>
                        </div>

                        {!form.isEveryone && (
                            <div className="space-y-6">
                                <TargetSection
                                    title="Target Roles"
                                    items={availableRoles}
                                    selected={form.targetRoles}
                                    onToggle={(id) => toggleItem("targetRoles", id)}
                                />

                                <TargetSection
                                    title="Departments"
                                    items={availableDepartments}
                                    selected={form.targetDepartments}
                                    onToggle={handleDeptToggle}
                                />

                                {!form.targetDepartments.includes("all") && (
                                    <TargetSection
                                        title="Specific Programs"
                                        items={availablePrograms.filter((p) =>
                                            form.targetDepartments.includes(p.dept)
                                        )}
                                        selected={form.targetPrograms}
                                        onToggle={(id) => toggleItem("targetPrograms", id)}
                                    />
                                )}

                                <TargetSection
                                    title="Groups / Sections"
                                    items={availableGroups}
                                    selected={form.targetGroups}
                                    onToggle={(id) => toggleItem("targetGroups", id)}
                                />
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

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

/**
 * Internal UI helper for targeting sections (Roles, Depts, etc.)
 */
function TargetSection({
    title,
    items,
    selected,
    onToggle
}: {
    title: string,
    items: { id: string, label: string }[],
    selected: string[],
    onToggle: (id: string) => void
}) {
    return (
        <div className="space-y-2.5">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 pl-1">
                {title}
            </Label>
            <div className="flex flex-wrap gap-1.5">
                {items.map((item) => {
                    const active = selected.includes(item.id);
                    return (
                        <Badge
                            key={item.id}
                            variant={active ? "default" : "secondary"}
                            className="cursor-pointer transition-all hover:bg-primary/90 hover:text-primary-foreground px-2.5 py-0.5 text-xs font-medium"
                            onClick={() => onToggle(item.id)}
                        >
                            {item.label}
                            {active && item.id !== "all" && (
                                <X className="w-3 h-3 ml-1 opacity-50" />
                            )}
                        </Badge>
                    );
                })}
            </div>
        </div>
    );
}
