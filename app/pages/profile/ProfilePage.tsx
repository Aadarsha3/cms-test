import { useLocation } from "wouter";
import { useProfileFetcher } from "@/hooks/useProfileFetcher";
import { ProfileView } from "./ProfileView";

export function ProfilePage() {
  const [, setLocation] = useLocation();
  const { accountData, roleData, loading, roleNotFound, authUser } = useProfileFetcher();

  if (!authUser) return null;

  const displayName = accountData?.displayName || authUser.name;
  const isStudent = authUser.role === "student";
  const isStaffStaff = ["staff", "admin", "teacher"].includes(authUser.role);

  return (
    <ProfileView
      accountData={accountData}
      roleData={roleData}
      loading={loading}
      roleNotFound={roleNotFound}
      authUser={authUser}
      displayName={displayName}
      isStudent={isStudent}
      isStaffStaff={isStaffStaff}
      onChangePassword={() => setLocation("/change-password")}
    />
  );
}
