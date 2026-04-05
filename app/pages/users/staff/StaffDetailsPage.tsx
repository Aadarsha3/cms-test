import { useAuth } from "@/lib/auth-context";
import { useRoute } from "wouter";
import { StaffDetail } from "@/pages/users/user.types";
import { useManagementDetails } from "@/hooks/useManagementDetails";
import { StaffDetailsView } from "./StaffDetailsView";

const EDITABLE_FIELDS: (keyof StaffDetail)[] = [
  "fullName", "email", "phoneNumber", "dateOfBirth", "gender",
  "address", "joinDate", "terminationDate"
];

const DATE_FIELDS: (keyof StaffDetail)[] = ["dateOfBirth", "joinDate", "terminationDate"];

export function StaffDetailsPage() {
  const { hasPermission } = useAuth();
  const [, params] = useRoute("/staff/:id");
  const staffId = params?.id;

  const {
    data: staff,
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
  } = useManagementDetails<StaffDetail>({
    entityType: "staffs",
    entityId: staffId,
    onSuccessPath: "/staff",
    editableFields: EDITABLE_FIELDS,
    dateFields: DATE_FIELDS,
  });

  return (
    <StaffDetailsView
      staff={staff}
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
