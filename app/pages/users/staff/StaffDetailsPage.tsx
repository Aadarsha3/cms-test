import { useAuth } from "@/lib/auth-context";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { StaffDetail } from "@/pages/users/user.types";
import { useManagementDetails } from "@/hooks/useManagementDetails";
import { dashboardApi, userApi } from "@/lib/api";
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

  const { data: authorities = {}, isLoading: loadingAuthorities } = useQuery({
    queryKey: ['staffAuthorities', staff?.userAccountId || staff?.userId],
    queryFn: async () => {
      const uid = staff?.userAccountId || staff?.userId;
      if (!uid) return {};
      const response = await userApi.get(`/users/${uid}/authorities/all`);
      return response.data.authorities || {};
    },
    enabled: !!(staff?.userAccountId || staff?.userId),
  });

  return (
    <StaffDetailsView
      authorities={authorities}
      loadingAuthorities={loadingAuthorities}
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
