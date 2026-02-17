import { ProfileDetailsForm } from "./ProfileDetailsForm";
import { StudentAcademicForm } from "./StudentAcademicForm";
import { UserDocumentUpload } from "./UserDocumentUpload";
import { ProfileFormData, StudentFormData } from "../../users";

interface StepThreeProfileDetailsProps {
    profileData: ProfileFormData;
    setProfileData: (data: ProfileFormData) => void;
    studentData: StudentFormData;
    setStudentData: (data: StudentFormData) => void;
    documents: any[];
    setDocuments: React.Dispatch<React.SetStateAction<any[]>>;
    isAdmin: boolean;
    userDepartment?: string;
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
}: StepThreeProfileDetailsProps) {
    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="max-w-3xl mx-auto space-y-6">
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
