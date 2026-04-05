import { useAuth } from "@/lib/auth-context";
import { useRoute } from "wouter";
import { roleLabels, UserDetail } from "./user.types";
import { useUserAccountDetails } from "@/hooks/useUserAccountDetails";
import { fixDateArray } from "@/lib/utils";
import { UserDetailsView } from "./UserDetailsView";

export function UserDetailsPage() {
  const { user: currentUser } = useAuth();
  const [, params] = useRoute("/users/:id");
  const userId = params?.id;

  const {
    user,
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
  } = useUserAccountDetails(userId);

  const goBack = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const from = searchParams.get("from");
    if (from && from !== "dashboard") return window.history.back();
    
    if (!user) return window.history.back();
    const role = user.role?.toLowerCase();
    if (role === "student") window.location.href = "/students";
    else if (role === "teacher") window.location.href = "/teachers";
    else if (role && ["staff", "admin"].includes(role)) window.location.href = "/staff";
    else window.location.href = "/dashboard";
  };

  const isSelf = currentUser?.id === user?.id;
  const canEdit = currentUser?.role === "admin" && !isSelf;
  const displayRole = user?.role || "member";
  const joinedDate = user 
    ? (fixDateArray((user as any).createdDate || user.createdAt) || (user.createdTimestamp ? new Date(user.createdTimestamp).toLocaleDateString() : "N/A"))
    : "N/A";

  return (
    <UserDetailsView
      user={user}
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
      canEdit={canEdit}
      displayRole={displayRole}
      joinedDate={joinedDate}
    />
  );
}
