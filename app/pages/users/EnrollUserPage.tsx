import { useAuth } from "@/lib/auth-context";
import { useEnrollmentForm } from "@/hooks/useEnrollmentForm";
import { EnrollUserView } from "./EnrollUserView";

export function EnrollUserPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const {
    currentStep,
    editingUserId,
    accountData,
    setAccountData,
    profileData,
    setProfileData,
    studentData,
    setStudentData,
    newDocuments,
    setNewDocuments,
    handleNextStep,
    handleSave,
    error,
    allowedRoles,
    goBack,
    context
  } = useEnrollmentForm();

  return (
    <EnrollUserView
      editingUserId={editingUserId}
      currentStep={currentStep}
      accountData={accountData}
      setAccountData={setAccountData}
      profileData={profileData}
      setProfileData={setProfileData}
      studentData={studentData}
      setStudentData={setStudentData}
      newDocuments={newDocuments}
      setNewDocuments={setNewDocuments}
      handleNextStep={handleNextStep}
      handleSave={handleSave}
      allowedRoles={allowedRoles}
      goBack={goBack}
      isAdmin={isAdmin}
      context={context}
      error={error}
    />
  );
}
