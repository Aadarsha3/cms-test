import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ProfileFormData, roleLabels } from "../../user.types";

interface StepTwoRoleSelectionProps {
    profileData: ProfileFormData;
    setProfileData: (data: ProfileFormData) => void;
    isSuperAdmin: boolean;
    allowedRoles: string[];
}

export function StepTwoRoleSelection({
    profileData,
    setProfileData,
    isSuperAdmin,
    allowedRoles,
}: StepTwoRoleSelectionProps) {
    if (allowedRoles.length === 1) {
        return (
            <div className="max-w-xl mx-auto w-full">
                <div className="grid gap-2">
                    <Label htmlFor="role">Primary Role</Label>
                    <div className="p-3 bg-muted rounded-md text-sm font-medium border text-muted-foreground cursor-not-allowed">
                        {/* Typecast to keyof typeof roleLabels to correctly render the badge label */}
                        {roleLabels[allowedRoles[0] as keyof typeof roleLabels] || allowedRoles[0]}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto w-full">
            <div className="grid gap-2">
                <Label htmlFor="role">Primary Role</Label>
                <Select
                    value={profileData.role}
                    onValueChange={(v) => setProfileData({ ...profileData, role: v })}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {allowedRoles.includes("student") && <SelectItem value="student">Student</SelectItem>}
                        {allowedRoles.includes("teacher") && <SelectItem value="teacher">Teacher</SelectItem>}
                        {allowedRoles.includes("staff") && <SelectItem value="staff">Staff</SelectItem>}
                        {isSuperAdmin && allowedRoles.includes("admin") && <SelectItem value="admin">Admin</SelectItem>}
                        {isSuperAdmin && allowedRoles.includes("super_admin") && (
                            <SelectItem value="super_admin">Super Admin</SelectItem>
                        )}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
