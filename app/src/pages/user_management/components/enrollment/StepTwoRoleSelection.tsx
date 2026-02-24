import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ProfileFormData } from "../../user.types";

interface StepTwoRoleSelectionProps {
    profileData: ProfileFormData;
    setProfileData: (data: ProfileFormData) => void;
    isSuperAdmin: boolean;
}

export function StepTwoRoleSelection({
    profileData,
    setProfileData,
    isSuperAdmin,
}: StepTwoRoleSelectionProps) {
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
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                        {isSuperAdmin && <SelectItem value="admin">Admin</SelectItem>}
                        {isSuperAdmin && (
                            <SelectItem value="super_admin">Super Admin</SelectItem>
                        )}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
