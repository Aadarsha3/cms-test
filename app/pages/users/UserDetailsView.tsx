import React from "react";
import { User, Mail, Activity } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { InfoField } from "@/components/common/InfoField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneInputField } from "@/components/common/PhoneInputField";
import { UserDocuments } from "@/components/user/UserDocuments";
import { roleLabels, roleColors } from "./user.types";
import { ProfileHeader } from "@/components/user/ProfileHeader";
import { DetailsLoading } from "@/components/common/details/DetailsLoading";
import { DetailsError } from "@/components/common/details/DetailsError";
import { DetailsActionBar } from "@/components/common/details/DetailsActionBar";

interface UserDetailsViewProps {
  user: any;
  loading: boolean;
  error: string | null;
  isEditing: boolean;
  editFormData: any;
  setEditFormData: (data: any) => void;
  saving: boolean;
  handleDelete: (cb: () => void) => void;
  handleSave: () => void;
  handleCancel: () => void;
  handleEdit: () => void;
  goBack: () => void;
  canEdit: boolean;
  displayRole: string;
  joinedDate: string;
}

export function UserDetailsView({
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
  goBack,
  canEdit,
  displayRole,
  joinedDate,
}: UserDetailsViewProps) {
  if (loading) return <DetailsLoading title="User Details" />;

  if (error || !user) {
    return (
      <DetailsError
        title="User Details"
        error={error || "User not found"}
        backLabel="Go Back"
        onBack={goBack}
      />
    );
  }

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
            <CardHeader>
              <CardTitle className="text-lg">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <InfoField
                  label="Username"
                  value={user.username}
                  icon={User}
                  isEditable
                  isEditing={isEditing}
                  fieldKey="username"
                  editFormData={editFormData}
                  setEditFormData={setEditFormData}
                />
                <InfoField
                  label="Primary Email"
                  value={user.primaryEmail}
                  icon={Mail}
                  isEditable
                  isEditing={isEditing}
                  fieldKey="primaryEmail"
                  editFormData={editFormData}
                  setEditFormData={setEditFormData}
                />
                <PhoneInputField
                  label="Phone Number"
                  value={(isEditing ? editFormData.phone : user.phone) || ""}
                  onChange={(v) => setEditFormData({ ...editFormData, phone: v })}
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Identity & Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <InfoField
                  label="System Role"
                  value={roleLabels[displayRole] || displayRole}
                  icon={User}
                />
                <InfoField
                  label="Account Status"
                  value={user.status}
                  icon={Activity}
                  isEditable
                  isEditing={isEditing}
                  fieldKey="status"
                  editFormData={editFormData}
                  setEditFormData={setEditFormData}
                  options={[
                    { label: "Active", value: "active" },
                    { label: "Inactive", value: "inactive" },
                  ]}
                />
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
