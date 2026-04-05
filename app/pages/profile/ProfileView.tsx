
import { User, Mail, MapPin, Heart, Key, ExternalLink } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { InfoField } from "@/components/common/InfoField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PhoneInputField } from "@/components/common/PhoneInputField";
import { DatePickerField } from "@/components/common/DatePickerField";
import { ProfileHeader } from "@/components/user/ProfileHeader";
import { DetailsLoading } from "@/components/common/details/DetailsLoading";
import { roleLabels, roleColors } from "@/pages/users/user.types";

interface ProfileViewProps {
  accountData: any;
  roleData: any;
  loading: boolean;
  roleNotFound: boolean;
  authUser: any;
  displayName: string;
  isStudent: boolean;
  isStaffStaff: boolean;
  onChangePassword: () => void;
}

export function ProfileView({
  accountData,
  roleData,
  loading,
  roleNotFound,
  authUser,
  displayName,
  isStudent,
  isStaffStaff,
  onChangePassword,
}: ProfileViewProps) {
  if (!authUser) return null;
  if (loading) return <DetailsLoading title="My Profile" />;

  return (
    <MainLayout title="My Profile">
      <div className="max-w-4xl mx-auto space-y-6 pb-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-foreground/90">My Profile</h1>
          <Button onClick={onChangePassword} size="sm" variant="outline" className="gap-2 shadow-sm">
            <Key className="h-4 w-4" /> Change Password <ExternalLink className="h-3 w-3 opacity-50" />
          </Button>
        </div>

        <ProfileHeader
          displayName={displayName}
          roleLabel={roleLabels[authUser.role]}
          roleColor={roleColors[authUser.role]}
          username={accountData?.username}
          email={accountData?.primaryEmail || authUser.email}
          userId={accountData?.id || authUser.id}
          createdDate={accountData?.createdDate}
        />

        {roleData && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <InfoField label="Full Name" value={roleData.fullName || displayName} icon={User} />
                  <InfoField
                    label="Email Address"
                    value={roleData.email || accountData?.primaryEmail || authUser.email}
                    icon={Mail}
                  />
                  <PhoneInputField
                    label="Phone Number"
                    value={roleData.phoneNumber || ""}
                    onChange={() => {}}
                    disabled
                  />
                  <DatePickerField
                    label="Date of Birth"
                    value={roleData.dateOfBirth || ""}
                    onChange={() => {}}
                    disabled
                  />
                  <InfoField label="Gender" value={roleData.gender || "N/A"} icon={User} />
                  <InfoField
                    label="Address"
                    value={roleData.address || roleData.presentAddress || "N/A"}
                    icon={MapPin}
                  />
                </div>
              </CardContent>
            </Card>

            {(isStudent || isStaffStaff) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {isStudent ? "Guardian Information" : "Employment Details"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isStudent ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <InfoField
                        label="Guardian Name"
                        value={roleData.guardianName || "N/A"}
                        icon={User}
                      />
                      <PhoneInputField
                        label="Contact Number"
                        value={roleData.guardianPhoneNumber || ""}
                        onChange={() => {}}
                        disabled
                      />
                      <InfoField
                        label="Relationship"
                        value={roleData.guardianRelation || "N/A"}
                        icon={Heart}
                      />
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <DatePickerField
                        label="Join Date"
                        value={roleData.joinDate || ""}
                        onChange={() => {}}
                        disabled
                      />
                      <DatePickerField
                        label="Termination Date"
                        value={roleData.terminationDate || ""}
                        onChange={() => {}}
                        disabled
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}

        {roleNotFound && !roleData && (
          <Card className="border-border bg-muted/30">
            <CardContent className="p-6 text-center text-muted-foreground space-y-1">
              <p className="font-medium">Detailed profile not yet available</p>
              <p className="text-sm">
                Your {isStudent ? "student" : "staff"} record has not been created by an
                administrator yet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
