import { RoleAssignment } from "./RoleAssignment";
import { ProfileDetailsForm } from "./ProfileDetailsForm";
import { StudentAcademicForm } from "./StudentAcademicForm";
import { UserDocumentUpload } from "./UserDocumentUpload";
import { ProfileFormData, StudentFormData } from "../../users";

interface StepTwoRoleDetailsProps {
  profileData: ProfileFormData;
  setProfileData: (data: ProfileFormData) => void;
  studentData: StudentFormData;
  setStudentData: (data: StudentFormData) => void;
  documents: any[];
  setDocuments: React.Dispatch<React.SetStateAction<any[]>>;

  // UI/Context Props
  userFullName: string;
  avatarUpload: string | null;
  setAvatarUpload: (url: string | null) => void;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  userDepartment?: string;
}

export function StepTwoRoleDetails({
  profileData,
  setProfileData,
  studentData,
  setStudentData,
  documents,
  setDocuments,
  userFullName,
  avatarUpload,
  setAvatarUpload,
  isSuperAdmin,
  isAdmin,
  userDepartment,
}: StepTwoRoleDetailsProps) {
  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
        {/* Left Column: Photo & Role configuration */}
        <div className="space-y-6">
          <RoleAssignment
            data={profileData}
            setData={setProfileData}
            userFullName={userFullName}
            avatarUpload={avatarUpload}
            setAvatarUpload={setAvatarUpload}
            isSuperAdmin={isSuperAdmin}
          />
        </div>

        {/* Right Column: Details Form */}
        <div className="space-y-6">
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
    </div>
  );
}
