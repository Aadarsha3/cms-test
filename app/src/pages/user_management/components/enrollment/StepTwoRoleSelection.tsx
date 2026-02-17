import { RoleAssignment } from "./RoleAssignment";
import { ProfileFormData } from "../../users";

interface StepTwoRoleSelectionProps {
    profileData: ProfileFormData;
    setProfileData: (data: ProfileFormData) => void;
    userFullName: string;
    avatarUpload: string | null;
    setAvatarUpload: (url: string | null) => void;
    isSuperAdmin: boolean;
}

export function StepTwoRoleSelection({
    profileData,
    setProfileData,
    userFullName,
    avatarUpload,
    setAvatarUpload,
    isSuperAdmin,
}: StepTwoRoleSelectionProps) {
    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="max-w-xl mx-auto">
                <RoleAssignment
                    data={profileData}
                    setData={setProfileData}
                    userFullName={userFullName}
                    avatarUpload={avatarUpload}
                    setAvatarUpload={setAvatarUpload}
                    isSuperAdmin={isSuperAdmin}
                />
            </div>
        </div>
    );
}
