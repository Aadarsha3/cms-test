import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { InfoField } from "@/components/common/InfoField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { dashboardApi, userApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { User, Mail, MapPin } from "lucide-react";
import { PhoneInputField } from "@/components/common/PhoneInputField";
import { DatePickerField } from "@/components/common/DatePickerField";
import { useRoute } from "wouter";

import { StaffDetail, roleLabels, roleColors } from "@/pages/users/user.types";
import { ProfileHeader } from "@/components/user/ProfileHeader";
import { DetailsLoading } from "@/components/common/details/DetailsLoading";
import { DetailsError } from "@/components/common/details/DetailsError";
import { DetailsActionBar } from "@/components/common/details/DetailsActionBar";
import { useManagementDetails } from "@/hooks/useManagementDetails";

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

  if (loading) return <DetailsLoading title="Staff Details" />;
  if (error || !staff) {
    return <DetailsError title="Staff Details" error={error || "Staff member not found"} backLabel="Go Back" onBack={goBack} />;
  }

  return (
    <MainLayout title="Staff Details">
      <div className="max-w-4xl mx-auto space-y-6 pb-10">
        <DetailsActionBar
          backLabel="Go Back"
          onBack={goBack}
          canEdit={hasPermission("users_edit")}
          isEditing={isEditing}
          saving={saving}
          onEdit={handleEdit}
          onSave={handleSave}
          onDelete={handleDelete}
          onCancel={handleCancel}
          editLabel="Edit Profile"
          deleteLabel="Delete Staff"
          confirmDelete={{
            title: "Terminate Staff Member?",
            description: `Are you sure you want to delete ${staff.fullName}? This action cannot be undone.`
          }}
        />

        <ProfileHeader
          displayName={staff.fullName}
          roleLabel={roleLabels[staff.designation.toLowerCase()] || staff.designation}
          roleColor={roleColors[staff.designation.toLowerCase()] || "bg-slate-500"}
          username={staff.username}
          email={staff.email || staff.primaryEmail}
          userId={staff.userAccountId || staff.id}
          createdDate={staff.accountCreatedDate}
          isTerminated={!!staff.terminationDate}
        />


        {/* Personal Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Staff Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <InfoField
                label="Full Name"
                value={staff.fullName}
                icon={User}
                isEditable
                isEditing={isEditing}
                fieldKey="fullName"
                editFormData={editFormData}
                setEditFormData={setEditFormData}
              />
              <InfoField
                label="Email Address"
                value={staff.email}
                icon={Mail}
                isEditable
                isEditing={isEditing}
                fieldKey="email"
                editFormData={editFormData}
                setEditFormData={setEditFormData}
                inputType="email"
              />
              <PhoneInputField
                label="Phone Number"
                value={(isEditing ? editFormData.phoneNumber : staff.phoneNumber) || ""}
                onChange={(v) => setEditFormData({ ...editFormData, phoneNumber: v })}
                disabled={!isEditing}
              />
              <DatePickerField
                label="Date of Birth"
                value={(isEditing ? editFormData.dateOfBirth : staff.dateOfBirth) || ""}
                onChange={(date) => setEditFormData({ ...editFormData, dateOfBirth: date })}
                disabled={!isEditing}
              />
              <InfoField
                label="Gender"
                value={staff.gender}
                icon={User}
                isEditable
                isEditing={isEditing}
                fieldKey="gender"
                editFormData={editFormData}
                setEditFormData={setEditFormData}
                options={[
                  { label: "Male", value: "Male" },
                  { label: "Female", value: "Female" },
                  { label: "Other", value: "Other" }
                ]}
              />
              <InfoField
                label="Address"
                value={staff.address}
                icon={MapPin}
                isEditable
                isEditing={isEditing}
                fieldKey="address"
                editFormData={editFormData}
                setEditFormData={setEditFormData}
              />
            </div>
          </CardContent>
        </Card>

        {/* Professional Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Employment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <DatePickerField
                label="Join Date"
                value={(isEditing ? editFormData.joinDate : staff.joinDate) || ""}
                onChange={(date) => setEditFormData({ ...editFormData, joinDate: date })}
                disabled={!isEditing}
              />
              <DatePickerField
                label="Termination Date"
                value={(isEditing ? editFormData.terminationDate : staff.terminationDate) || ""}
                onChange={(date) => setEditFormData({ ...editFormData, terminationDate: date })}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

