import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { InfoField } from "@/components/common/InfoField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, MapPin, Heart } from "lucide-react";
import { PhoneInputField } from "@/components/common/PhoneInputField";
import { DatePickerField } from "@/components/common/DatePickerField";
import { ProfileHeader } from "@/components/user/ProfileHeader";
import { DetailsLoading } from "@/components/common/details/DetailsLoading";
import { DetailsError } from "@/components/common/details/DetailsError";
import { DetailsActionBar } from "@/components/common/details/DetailsActionBar";

interface StudentDetailsViewProps {
  student: any;
  loading: boolean;
  error: string | null;
  isEditing: boolean;
  editFormData: any;
  setEditFormData: (data: any) => void;
  saving: boolean;
  handleDelete: () => void;
  handleSave: () => void;
  handleCancel: () => void;
  handleEdit: () => void;
  goBack: () => void;
  hasPermission: (perm: string) => boolean;
}

export function StudentDetailsView({
  student,
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
  hasPermission,
}: StudentDetailsViewProps) {
  if (loading) return <DetailsLoading title="Student Details" />;
  if (error || !student) {
    return (
      <DetailsError
        title="Student Details"
        error={error || "Student not found"}
        backLabel="Go Back"
        onBack={goBack}
      />
    );
  }

  return (
    <MainLayout title="Student Details">
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
          deleteLabel="Delete Student"
          confirmDelete={{
            title: "Delete Student Account?",
            description: `This will permanently remove ${student.fullName} and all linked records.`,
          }}
        />

        <ProfileHeader
          displayName={student.fullName}
          roleLabel="Student"
          username={student.username}
          email={student.email || student.primaryEmail}
          userId={student.userAccountId || student.id}
          createdDate={student.accountCreatedDate}
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <InfoField
                label="Full Name"
                value={student.fullName}
                icon={User}
                isEditable
                isEditing={isEditing}
                fieldKey="fullName"
                editFormData={editFormData}
                setEditFormData={setEditFormData}
              />
              <InfoField
                label="Email Address"
                value={student.email}
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
                value={(isEditing ? editFormData.phoneNumber : student.phoneNumber) || ""}
                onChange={(v) => setEditFormData({ ...editFormData, phoneNumber: v })}
                disabled={!isEditing}
              />
              <DatePickerField
                label="Date of Birth"
                value={(isEditing ? (editFormData.dateOfBirth as string) : student.dateOfBirth) || ""}
                onChange={(date) => setEditFormData({ ...editFormData, dateOfBirth: date })}
                disabled={!isEditing}
              />
              <InfoField
                label="Gender"
                value={student.gender}
                icon={User}
                isEditable
                isEditing={isEditing}
                fieldKey="gender"
                editFormData={editFormData}
                setEditFormData={setEditFormData}
                options={[
                  { label: "Male", value: "Male" },
                  { label: "Female", value: "Female" },
                  { label: "Other", value: "Other" },
                ]}
              />
              <InfoField
                label="Address"
                value={student.presentAddress}
                icon={MapPin}
                isEditable
                isEditing={isEditing}
                fieldKey="presentAddress"
                editFormData={editFormData}
                setEditFormData={setEditFormData}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Guardian Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <InfoField
                label="Guardian Name"
                value={student.guardianName}
                icon={User}
                isEditable
                isEditing={isEditing}
                fieldKey="guardianName"
                editFormData={editFormData}
                setEditFormData={setEditFormData}
              />
              <PhoneInputField
                label="Contact Number"
                value={
                  (isEditing ? editFormData.guardianPhoneNumber : student.guardianPhoneNumber) || ""
                }
                onChange={(v) => setEditFormData({ ...editFormData, guardianPhoneNumber: v })}
                disabled={!isEditing}
              />
              <InfoField
                label="Relationship"
                value={student.guardianRelation}
                icon={Heart}
                isEditable
                isEditing={isEditing}
                fieldKey="guardianRelation"
                editFormData={editFormData}
                setEditFormData={setEditFormData}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
