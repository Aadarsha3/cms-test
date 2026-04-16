import { useAuth } from "@/lib/auth-context";
import { useRoute } from "wouter";
import { StudentDetail } from "@/pages/users/user.types";
import { useManagementDetails } from "@/hooks/useManagementDetails";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/lib/api";
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

  const { data: authorities = {}, isLoading: loadingAuthorities } = useQuery({
    queryKey: ['studentAuthorities', student?.userAccountId || student?.id],
    queryFn: async () => {
      const uid = student?.userAccountId || student?.id;
      if (!uid) return {};
      const response = await userApi.get(`/users/${uid}/authorities/all`);
      return response.data.authorities || {};
    },
    enabled: !!(student?.userAccountId || student?.id),
  });

  return (
    <StudentDetailsView
      authorities={authorities}
      loadingAuthorities={loadingAuthorities}
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
