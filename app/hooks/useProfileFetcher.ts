import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { dashboardApi, userApi } from "@/lib/api";
import { fixDates } from "@/lib/utils";
import { StudentDetail, StaffDetail, UserDetail } from "@/pages/users/user.types";

export interface UserAccountData {
  id: string;
  primaryEmail: string;
  username: string;
  displayName: string;
  createdDate: string;
}

export type ProfileRoleData = StudentDetail | StaffDetail;

export interface UseProfileFetcherReturn {
  accountData: UserAccountData | null;
  roleData: ProfileRoleData | null;
  loading: boolean;
  roleNotFound: boolean;
  authUser: ReturnType<typeof useAuth>["user"];
}

export function useProfileFetcher(): UseProfileFetcherReturn {
  const { user: authUser, setAuthUser } = useAuth();
  const [accountData, setAccountData] = useState<UserAccountData | null>(null);
  const [roleData, setRoleData] = useState<ProfileRoleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [roleNotFound, setRoleNotFound] = useState(false);

  useEffect(() => {
    if (!authUser) return;

    const fetchProfile = async () => {
      setLoading(true);
      let userUuid: string | null = null;
      let acctDataRef: UserAccountData | null = null;
      let roleDataRef: ProfileRoleData | null = null;

      // 1. Resolve UUID + Fetch Account
      try {
        const listRes = await userApi.get<{ content: UserDetail[] } | UserDetail[]>("/users", { params: { size: 500 } });
        const users = Array.isArray(listRes.data) ? listRes.data : listRes.data?.content || [];
        const match = users.find((u) => u.username === authUser.id || u.id === authUser.id);

        if (match) {
          userUuid = match.id;
          const res = await userApi.get<UserAccountData>(`/users/${userUuid}`);
          const acct = res.data;
          fixDates(acct, ["createdDate"]);
          setAccountData(acct);
          acctDataRef = acct;

        }
      } catch (e) {
        console.warn("[ProfileHook] Account resolution failed:", e);
      }

      // 2. Fetch Role Data
      const lookupId = userUuid || authUser.id;
      const lookupEmail = acctDataRef?.primaryEmail || authUser.email;
      const isStudent = authUser.role === "student";
      const endpoint = isStudent ? "/students" : "/staffs";

      try {
        const listRes = await dashboardApi.get<{ content: any[] } | any[]>(endpoint, { params: { size: 1000 } });
        const list = Array.isArray(listRes.data) ? listRes.data : (listRes.data as any)?.content || [];

        const match = list.find((item: any) => {
          const itemUserId =
            item.userAccountId ||
            item.userId ||
            (typeof item.user === 'object' ? item.user?.id : item.user) ||
            (typeof item.userAccount === 'object' ? item.userAccount?.id : item.userAccount);

          return itemUserId === lookupId ||
            item.id === lookupId ||
            (item.email && lookupEmail && item.email.toLowerCase() === lookupEmail.toLowerCase());
        });

        if (match) {
          const detailRes = await dashboardApi.get<ProfileRoleData>(`${endpoint}/${match.id || match.userId}`);
          const data = detailRes.data;
          fixDates(data, ["dateOfBirth", "joinDate", "terminationDate"]);
          setRoleData(data);
          roleDataRef = data;
          setRoleNotFound(false);
        } else {
          setRoleNotFound(true);
        }
      } catch (e) {
        console.warn("[ProfileHook] Role fetch failed:", e);
        setRoleNotFound(true);
      } finally {
        // 3. FINAL SESSION SYNC
        if (authUser) {
          const isStaff = authUser.role !== "student";
          const staffObj = (isStaff ? roleDataRef : null) as StaffDetail | null;

          const finalName = staffObj?.fullName || acctDataRef?.displayName || authUser.name;
          const finalEmail = staffObj?.email || acctDataRef?.primaryEmail || authUser.email;

          if (finalName !== authUser.name || finalEmail !== authUser.email) {
            console.log("[ProfileHook] Final Syncing session header:", { finalName, finalEmail });
            setAuthUser({
              ...authUser,
              name: finalName,
              email: finalEmail
            });
          }
        }
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authUser?.id, authUser?.role]);

  return { accountData, roleData, loading, roleNotFound, authUser };
}

