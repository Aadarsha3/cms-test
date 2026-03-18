import { ProfileDetailsForm } from "./ProfileDetailsForm";
import { StudentAcademicForm } from "./StudentAcademicForm";
import { UserDocumentUpload } from "./UserDocumentUpload";
import { ProfileFormData, StudentFormData } from "../../user.types";
import { useRef, ChangeEvent } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Upload } from "lucide-react";

interface StepThreeProfileDetailsProps {
    profileData: ProfileFormData;
    setProfileData: (data: ProfileFormData) => void;
    studentData: StudentFormData;
    setStudentData: (data: StudentFormData) => void;
    documents: any[];
    setDocuments: React.Dispatch<React.SetStateAction<any[]>>;
    isAdmin: boolean;
    userDepartment?: string;
    userFullName: string;
    avatarUpload: string | null;
    setAvatarUpload: (url: string | null) => void;
}

export function StepThreeProfileDetails({
    profileData,
    setProfileData,
    studentData,
    setStudentData,
    documents,
    setDocuments,
    isAdmin,
    userDepartment,
    userFullName,
    avatarUpload,
    setAvatarUpload,
}: StepThreeProfileDetailsProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast({
                    title: "Image size should be less than 5MB",
                    variant: "destructive",
                });
                return;
            }
            const url = URL.createObjectURL(file);
            setAvatarUpload(url);
            toast({ title: "Photo selected" });
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="max-w-3xl mx-auto space-y-6">
                <Card>
                    <CardContent className="pt-6 flex flex-col items-center gap-4">
                        <div className="relative">
                            <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                                <AvatarImage src={avatarUpload || ""} />
                                <AvatarFallback className="text-4xl bg-muted">
                                    {userFullName.trim() ? (
                                        getInitials(userFullName)
                                    ) : (
                                        <Camera className="h-10 w-10 text-muted-foreground/50" />
                                    )}
                                </AvatarFallback>
                            </Avatar>
                            <Button
                                type="button"
                                variant="secondary"
                                size="icon"
                                className="absolute bottom-0 right-0 rounded-full shadow-md"
                                onClick={triggerFileInput}
                            >
                                <Upload className="h-4 w-4" />
                            </Button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </div>
                        <div className="text-center">
                            <h3 className="font-medium text-lg">{userFullName}</h3>
                            <p className="text-sm text-muted-foreground">Upload Profile Picture</p>
                        </div>
                    </CardContent>
                </Card>

                <ProfileDetailsForm
                    data={profileData}
                    setData={setProfileData}
                    isAdmin={isAdmin}
                    userDepartment={userDepartment}
                />

                {profileData.role === "student" && (
                    <StudentAcademicForm data={studentData} setData={setStudentData} />
                )}

                <UserDocumentUpload
                    documents={documents}
                    setDocuments={setDocuments}
                />
            </div>
        </div>
    );
}
