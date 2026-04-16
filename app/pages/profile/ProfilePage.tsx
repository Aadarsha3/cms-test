import { useLocation } from "wouter";
import { useProfileFetcher } from "@/hooks/useProfileFetcher";
import { ProfileView } from "./ProfileView";

export function ProfilePage() {
  const [, setLocation] = useLocation();
  const { accountData, roleData, loading, roleNotFound, authUser } = useProfileFetcher();

  if (!authUser) return null;

  const isStudent = authUser.role === "student";
  const isStaffStaff = ["staff", "admin", "teacher"].includes(authUser.role);
  const displayName = (!isStudent && (roleData as any)?.fullName) || accountData?.displayName || authUser.name;
  const displayEmail = (!isStudent && (roleData as any)?.email) || accountData?.primaryEmail || authUser.email;

  return (
    <ProfileView
      accountData={accountData}
      roleData={roleData}
      loading={loading}
      roleNotFound={roleNotFound}
      authUser={authUser}
      displayName={displayName}
      displayEmail={displayEmail}
      isStudent={isStudent}
      isStaffStaff={isStaffStaff}
      onChangePassword={() => setLocation("/change-password")}
    />
  );
}
