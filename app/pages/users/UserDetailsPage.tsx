import { User, Mail, Activity, Calendar } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { InfoField } from "@/components/common/InfoField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { PhoneInputField } from "@/components/common/PhoneInputField";
import { DatePickerField } from "@/components/common/DatePickerField";
import { useRoute } from "wouter";

import { UserDocuments } from "@/components/user/UserDocuments";
import { roleLabels, roleColors, UserDetail } from "./user.types";
import { ProfileHeader } from "@/components/user/ProfileHeader";
import { DetailsLoading } from "@/components/common/details/DetailsLoading";
import { DetailsError } from "@/components/common/details/DetailsError";
import { DetailsActionBar } from "@/components/common/details/DetailsActionBar";
import { useUserAccountDetails } from "@/hooks/useUserAccountDetails";
import { fixDateArray } from "@/lib/utils";


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

  if (loading) return <DetailsLoading title="User Details" />;

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


  if (error || !user) {
    return <DetailsError title="User Details" error={error || "User not found"} backLabel="Go Back" onBack={goBack} />;
  }

  const isSelf = currentUser?.id === user.id;
  const canEdit = currentUser?.role === "admin" && !isSelf;
  const displayRole = user.role || "member";
  const joinedDate = fixDateArray((user as any).createdDate || user.createdAt) || (user.createdTimestamp ? new Date(user.createdTimestamp).toLocaleDateString() : "N/A");

  return (
    <MainLayout title="User Details">
      <div className="max-w-4xl mx-auto space-y-6 pb-10">
        <DetailsActionBar
          backLabel="Go Back"
          onBack={goBack}
          canEdit={canEdit}
          isEditing={isEditing}
          saving={saving}
          onEdit={handleEdit}
          onSave={handleSave}
          onDelete={() => handleDelete(goBack)}
          onCancel={handleCancel}
          deleteLabel="Delete User"
        />

        <ProfileHeader
          displayName={user.username || "Unknown"}
          roleLabel={roleLabels[displayRole] || displayRole}
          roleColor={roleColors[displayRole]}
          email={user.primaryEmail}
          userId={user.id}
          createdDate={joinedDate}
          statusLabel={user.status === "active" ? "Active Account" : "Inactive"}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="text-lg">Account Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <InfoField label="Username" value={user.username} icon={User} isEditable isEditing={isEditing} fieldKey="username" editFormData={editFormData} setEditFormData={setEditFormData} />
                <InfoField label="Primary Email" value={user.primaryEmail} icon={Mail} isEditable isEditing={isEditing} fieldKey="primaryEmail" editFormData={editFormData} setEditFormData={setEditFormData} />
                <PhoneInputField label="Phone Number" value={(isEditing ? editFormData.phone : user.phone) || ""} onChange={(v) => setEditFormData({ ...editFormData, phone: v })} disabled={!isEditing} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Identity & Status</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <InfoField label="System Role" value={roleLabels[displayRole] || displayRole} icon={User} />
                <InfoField label="Account Status" value={user.status} icon={Activity} isEditable isEditing={isEditing} fieldKey="status" editFormData={editFormData} setEditFormData={setEditFormData} options={[{ label: "Active", value: "active" }, { label: "Inactive", value: "inactive" }]} />
                {user.universityId && <InfoField label="University ID" value={user.universityId} />}
                {user.User_Id && <InfoField label="Internal ID" value={user.User_Id} />}
              </div>
            </CardContent>
          </Card>
        </div>

        <UserDocuments user={user} isEditing={isEditing} />
      </div>
    </MainLayout>
  );
}

