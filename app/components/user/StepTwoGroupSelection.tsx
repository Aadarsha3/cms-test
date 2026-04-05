import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ProfileFormData, roleLabels } from "@/pages/users/user.types";

interface Group {
    id: string;
    name: string;
}

interface StepTwoGroupSelectionProps {
    profileData: ProfileFormData;
    setProfileData: (data: ProfileFormData) => void;
    allowedRoles: string[]; // Still passing this to filter groups locally if needed
}

export function StepTwoGroupSelection({
    profileData,
    setProfileData,
    allowedRoles,
}: StepTwoGroupSelectionProps) {
    const { toast } = useToast();
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchGroups = async () => {
        setLoading(true);
        try {
            const { userApi } = await import("@/lib/api");
            const response = await userApi.get("/groups");
            const fetchedGroups = Array.isArray(response.data) ? response.data :
                (response.data?.content || []);
            setGroups(fetchedGroups);
        } catch (err) {
            console.error("Failed to fetch groups, using fallback list:", err);
            const fallbackGroups = allowedRoles.map(role => ({
                id: role,
                name: role.charAt(0).toUpperCase() + role.slice(1) + "s"
            }));
            setGroups(fallbackGroups);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, [allowedRoles]);

    useEffect(() => {
        if (groups.length > 0 && !profileData.group) {
            // Try exact match first by ID
            const match = groups.find(g => g.id === profileData.role);
            if (match) {
                setProfileData({ ...profileData, role: match.id, group: match });
            } else if (allowedRoles.length === 1) {
                // For single-role contexts (e.g. student), auto-assign the first matching group
                const filtered = groups.filter(g =>
                    allowedRoles.some(allowed =>
                        (typeof g.name === 'string' && g.name.toLowerCase().includes(allowed.toLowerCase()))
                    )
                );
                if (filtered.length > 0) {
                    setProfileData({ ...profileData, role: filtered[0].id, group: filtered[0] });
                }
            }
        }
    }, [groups, profileData.role, profileData.group]);

    const filteredGroups = groups.filter(g => {
        return allowedRoles.some(allowed =>
            (typeof g.id === 'string' && g.id.toLowerCase() === allowed.toLowerCase()) ||
            (typeof g.name === 'string' && g.name.toLowerCase().includes(allowed.toLowerCase()))
        );
    });

    if (allowedRoles.length === 1) {
        return (
            <div className="max-w-xl mx-auto w-full">
                <div className="grid gap-2">
                    <Label htmlFor="group">Assigned Group</Label>
                    <div className="p-3 bg-muted rounded-md text-sm font-medium border text-muted-foreground cursor-not-allowed flex items-center gap-2">
                        {loading ? "Loading..." : (filteredGroups[0]?.name || allowedRoles[0])}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto w-full">
            <div className="grid gap-2">
                <Label htmlFor="group">Assign Group</Label>
                <Select
                    value={profileData.role}
                    onValueChange={(v) => {
                        const selectedGroup = groups.find(g => g.id === v);
                        setProfileData({ ...profileData, role: v, group: selectedGroup });
                    }}
                    disabled={loading}
                >
                    <SelectTrigger>
                        <SelectValue placeholder={loading ? "Loading groups..." : "Choose group"} />
                    </SelectTrigger>
                    <SelectContent>
                        {filteredGroups.length > 0 ? (
                            filteredGroups.map(group => (
                                <SelectItem key={group.id} value={group.id}>
                                    {group.name}
                                </SelectItem>
                            ))
                        ) : (
                            <SelectItem value="none" disabled>No matching groups found</SelectItem>
                        )}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
