import { createContext, useContext, useState, type ReactNode } from "react";
import { DEFAULT_ROLE_PERMISSIONS, type RolePermissions } from "./permissions";
import { signOutRedirect } from "./auth-client";

export type UserRole = "admin" | "staff" | "student" | "teacher";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  universityId?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  currentClass?: string;
  semester?: string;
  guardianName?: string;
  guardianContact?: string;
  guardianRelationship?: string;
  enrollmentDate?: string;
  program?: string;
  group?: string;

}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  setAuthUser: (user: AuthUser) => void;
  logout: () => void | Promise<void>;
  permissions: RolePermissions;
  updatePermissions: (newPermissions: RolePermissions) => void;
  hasPermission: (permissionId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);



export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem("authUser");
      const token = localStorage.getItem("access_token");
      let parsed = (stored && token) ? JSON.parse(stored) : null;
      if (parsed && parsed.role === "super_admin") {
        parsed.role = "admin";
      }
      return parsed;
    } catch (e) {
      console.error("Failed to restore user session:", e);
      localStorage.removeItem("authUser");
      return null;
    }
  });

  const [permissions, setPermissions] = useState<RolePermissions>(() => {
    try {
      const stored = localStorage.getItem("rolePermissions");
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_ROLE_PERMISSIONS, ...parsed };
      }
      return DEFAULT_ROLE_PERMISSIONS;
    } catch (e) {
      return DEFAULT_ROLE_PERMISSIONS;
    }
  });

  const updatePermissions = (newPermissions: RolePermissions) => {
    setPermissions(newPermissions);
    localStorage.setItem("rolePermissions", JSON.stringify(newPermissions));
  };

  const hasPermission = (permissionId: string) => {
    if (!user) return false;

    // Check main role permissions
    const rolePerms = permissions[user.role] || [];
    if (rolePerms.includes(permissionId)) return true;

    return false;
  };

  const login = async (_email: string, _password: string) => {
    throw new Error("Direct login is not supported. Use the OIDC authentication flow.");
  };

  const setAuthUser = (user: AuthUser) => {
    setUser(user);
    localStorage.setItem("authUser", JSON.stringify(user));
  };

  const logout = async () => {
    const idToken = localStorage.getItem("id_token");

    // Clear local session data
    localStorage.removeItem("authUser");
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("rolePermissions");
    localStorage.removeItem("refresh_token");

    // Redirect to backend to end session

    try {
      await signOutRedirect(idToken || undefined);
    } catch (error) {
      console.error("Failed to sign out redirect:", error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      setAuthUser,
      logout,
      permissions,
      updatePermissions,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}








