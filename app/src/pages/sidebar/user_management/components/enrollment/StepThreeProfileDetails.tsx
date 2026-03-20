import { ProfileDetailsForm } from "./ProfileDetailsForm";
import { StudentAcademicForm } from "./StudentAcademicForm";
import { ProfileFormData, StudentFormData, AccountFormData } from "../../user.types";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { User, Mail } from "lucide-react";

interface StepThreeProfileDetailsProps {
    accountData: AccountFormData;
    profileData: ProfileFormData;
    setProfileData: (data: ProfileFormData) => void;
    studentData: StudentFormData;
    setStudentData: (data: StudentFormData) => void;
    documents: any[];
    setDocuments: React.Dispatch<React.SetStateAction<any[]>>;
    isAdmin: boolean;
    userFullName: string;
    avatarUpload: string | null;
    setAvatarUpload: (url: string | null) => void;
    isEditing?: boolean;
}

export function StepThreeProfileDetails({
    accountData,
    profileData,
    setProfileData,
    studentData,
    setStudentData,
    documents,
    setDocuments,
    isAdmin,
    userFullName,
    avatarUpload,
    setAvatarUpload,
    isEditing,
}: StepThreeProfileDetailsProps) {
    const { toast } = useToast();

    const ReadOnlyField = ({ label, value, icon: Icon }: { label: string, value: React.ReactNode, icon: any }) => (
        <div className="space-y-1 min-w-0">
            <Label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Icon className="h-3 w-3" /> {label}
            </Label>
            <div className="text-sm font-medium truncate" title={typeof value === 'string' ? value : undefined}>
                {value}
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="max-w-3xl mx-auto space-y-6">
                <Card className="bg-muted/20 border-dashed">
                    <CardContent className="p-4 grid gap-4 grid-cols-1 sm:grid-cols-3">
                        <ReadOnlyField label="Name" value={userFullName} icon={User} />
                        <ReadOnlyField label="Username" value={accountData.userId} icon={User} />
                        <ReadOnlyField label="Email" value={accountData.email} icon={Mail} />
                    </CardContent>
                </Card>

                <ProfileDetailsForm
                    data={profileData}
                    setData={setProfileData}
                    studentData={studentData}
                    setStudentData={setStudentData}
                    isAdmin={isAdmin}
                    isEditing={isEditing}
                />

                {profileData.role === "student" && (
                    <StudentAcademicForm data={studentData} setData={setStudentData} />
                )}
            </div>
        </div>
    );
}
