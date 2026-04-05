import { ProfileDetailsForm } from "./ProfileDetailsForm";
import { StaffDetailsForm } from "./StaffDetailsForm";
import { ProfileFormData, StudentFormData, AccountFormData } from "@/pages/users/user.types";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { User, Mail, Shield, Calendar as CalendarIcon } from "lucide-react";
import { roleLabels } from "@/pages/users/user.types";

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
    isEditing?: boolean;
    context?: string | null;
    setAccountData: (data: AccountFormData) => void;
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
    isEditing,
    context,
    setAccountData,
}: StepThreeProfileDetailsProps) {
    const { toast } = useToast();

    const ReadOnlyField = ({ label, value, icon: Icon }: { label: string, value: React.ReactNode, icon: any }) => (
        <div className="space-y-1 min-w-0 min-h-[3rem]">
            <Label className="flex items-center gap-1.5 text-[10px] md:text-xs text-muted-foreground uppercase tracking-tight">
                <Icon className="h-3 w-3 shrink-0" /> {label}
            </Label>
            <div className="text-sm font-semibold break-all text-foreground/90" title={typeof value === 'string' ? value : undefined}>
                {value}
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-primary/5 px-4 py-2 border-b">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary/70">User Identity</span>
                    </div>
                    <CardContent className="p-0 bg-white/50 dark:bg-zinc-900/50">
                        {/* Row 1: Name & Username */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b p-4">
                            <ReadOnlyField label="Full Name" value={userFullName} icon={User} />
                            <ReadOnlyField label="Username" value={accountData.userId} icon={User} />
                        </div>
                        {/* Row 2: Email & Designation */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
                            <ReadOnlyField label="Primary Email" value={accountData.email} icon={Mail} />
                            <ReadOnlyField 
                                label="Designation"
                                value={profileData.group?.name || roleLabels[profileData.role] || profileData.role} 
                                icon={Shield} 
                            />
                        </div>
                    </CardContent>
                </div>

                {context === "student" ? (
                    <ProfileDetailsForm
                        data={profileData}
                        setData={setProfileData}
                        studentData={studentData}
                        setStudentData={setStudentData}
                        accountData={accountData}
                        setAccountData={setAccountData}
                        isAdmin={isAdmin}
                        isEditing={isEditing}
                    />
                ) : (
                    <StaffDetailsForm
                        data={profileData}
                        setData={setProfileData}
                        studentData={studentData}
                        setStudentData={setStudentData}
                        accountData={accountData}
                        setAccountData={setAccountData}
                        isAdmin={isAdmin}
                        isEditing={isEditing}
                    />
                )}
            </div>
        </div>
    );
}
