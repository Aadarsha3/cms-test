import { useAuth } from "@/lib/auth-context";
import { useRoute } from "wouter";
import { StudentDetail } from "@/pages/users/user.types";
import { useManagementDetails } from "@/hooks/useManagementDetails";
import { StudentDetailsView } from "./StudentDetailsView";

const EDITABLE_FIELDS: (keyof StudentDetail)[] = [
  "fullName", "email", "phoneNumber", "dateOfBirth", "gender",
  "presentAddress", "guardianName", "guardianPhoneNumber", "guardianRelation"
];

const DATE_FIELDS: (keyof StudentDetail)[] = ["dateOfBirth"];

export function StudentDetailsPage() {
  const { hasPermission } = useAuth();
  const [, params] = useRoute("/student/:id");
  const studentId = params?.id;

  const {
    data: student,
    loading,
    error,
    isEditing,
    editFormData,
    setEditFormData,
    saving,
    handleDelete,
    handleSave,
    handleCancel,
    handleEdit,
    goBack,
  } = useManagementDetails<StudentDetail>({
    entityType: "students",
    entityId: studentId,
    onSuccessPath: "/students",
    editableFields: EDITABLE_FIELDS,
    dateFields: DATE_FIELDS,
  });

  return (
    <StudentDetailsView
      student={student}
      loading={loading}
      error={error}
      isEditing={isEditing}
      editFormData={editFormData}
      setEditFormData={setEditFormData}
      saving={saving}
      handleDelete={handleDelete}
      handleSave={handleSave}
      handleCancel={handleCancel}
      handleEdit={handleEdit}
      goBack={goBack}
      hasPermission={hasPermission}
    />
  );
}
