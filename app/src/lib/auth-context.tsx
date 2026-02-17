import { createContext, useContext, useState, type ReactNode } from "react";
import { DEFAULT_ROLE_PERMISSIONS, type RolePermissions } from "./permissions";
import { signOutRedirect } from "./auth-client";

export type UserRole = "super_admin" | "admin" | "staff" | "student" | "teacher" | "student_council_president" | "student_council_member" | "sports_committee_member";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  subRoles?: string[];
  department?: string;
  avatarUrl?: string;
  // Staff-specific fields
  assignedCourses?: string[]; // Course codes that staff teaches
  User_Id?: string;
  // Student-specific fields
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
  enrolledCourses?: string[]; // Course codes student is enrolled in
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

// todo: remove mock functionality
const mockUsers: Record<string, AuthUser> = {
  "admin@college.edu": {
    id: "1",
    name: "Dr. Sarah Johnson",
    email: "admin@college.edu",
    role: "super_admin",
    User_Id: "SA2024001",
    department: "Administration",
  },
  "deptadmin@college.edu": {
    id: "4",
    name: "Prof. Alan Turing",
    email: "deptadmin@college.edu",
    role: "admin",
    User_Id: "ADM2024002",
    department: "Computer Science",
  },
  "staff@college.edu": {
    id: "2",
    name: "Prof. Michael Chen",
    email: "staff@college.edu",
    role: "staff",
    User_Id: "STF2024001",
    department: "Computer Science",
    assignedCourses: ["CS101", "CS201", "CS301", "CS401", "CS501"], // Courses this staff teaches
  },
  "student@college.edu": {
    id: "3",
    name: "Emily Parker",
    email: "student@college.edu",
    role: "student",
    department: "Computer Science",
    phone: "+1 555-0103",
    User_Id: "COL2024001",
    universityId: "UNI2024001",
    dateOfBirth: "2002-05-15",
    gender: "female",
    currentClass: "BCS Year 3",
    semester: "5",
    guardianName: "Robert Parker",
    guardianContact: "+1 555-0150",
    guardianRelationship: "Father",
    enrollmentDate: "2024-09-01",
    program: "Bachelor of Computer Science",
    group: "Section A",
    enrolledCourses: ["CS101", "CS201", "CS301"], // Courses student is enrolled in
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem("authUser");
      const token = localStorage.getItem("access_token");
      return (stored && token) ? JSON.parse(stored) : null;
    } catch (e) {
      console.error("Failed to restore user session:", e);
      localStorage.removeItem("authUser");
      return null;
    }
  });

  const [permissions, setPermissions] = useState<RolePermissions>(() => {
    try {
      const stored = localStorage.getItem("rolePermissions");
      return stored ? JSON.parse(stored) : DEFAULT_ROLE_PERMISSIONS;
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
    if (user.role === "super_admin") return true;

    // Check main role permissions
    const rolePerms = permissions[user.role] || [];
    if (rolePerms.includes(permissionId)) return true;

    // Check sub-role permissions
    if (user.subRoles && user.subRoles.length > 0) {
      for (const subRole of user.subRoles) {
        const subRolePerms = permissions[subRole] || [];
        if (subRolePerms.includes(permissionId)) return true;
      }
    }

    return false;
  };

  const login = async (email: string, _password: string) => {
    // todo: remove mock functionality - replace with real API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    const mockUser = mockUsers[email];
    if (mockUser) {
      setUser(mockUser);
      localStorage.setItem("authUser", JSON.stringify(mockUser));
    } else {
      throw new Error("Invalid credentials");
    }
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

    // Update state
    setUser(null);

    // Redirect to OIDC provider to end session
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
