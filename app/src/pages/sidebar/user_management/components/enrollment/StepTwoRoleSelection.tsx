import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ProfileFormData } from "../../user.types";
import { userApi } from "@/lib/api";

interface StepTwoRoleSelectionProps {
    profileData: ProfileFormData;
    setProfileData: (data: ProfileFormData) => void;
}

interface GroupResponse {
    id: string;
    name: string;
}

export function StepTwoRoleSelection({
    profileData,
    setProfileData,
}: StepTwoRoleSelectionProps) {
    const [groups, setGroups] = useState<GroupResponse[]>([]);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await userApi.get("/groups");
                if (Array.isArray(response.data)) {
                    setGroups(response.data);
                } else if (response.data && Array.isArray(response.data.content)) {
                    setGroups(response.data.content);
                }
            } catch (err) {
                console.error("Failed to fetch groups", err);
            }
        };
        fetchGroups();
    }, []);

    return (
        <div className="max-w-xl mx-auto w-full space-y-6">
            <div className="grid gap-2">
                <Label htmlFor="group">Assign Group</Label>
                <Select
                    value={profileData.groupId || ""}
                    onValueChange={(v) => setProfileData({ ...profileData, groupId: v })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select a Group" />
                    </SelectTrigger>
                    <SelectContent>
                        {groups.map((group) => (
                            <SelectItem key={group.id} value={group.id}>
                                {group.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
