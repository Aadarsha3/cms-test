export type PermissionAction =
    | "view"
    | "create"
    | "edit"
    | "delete"
    | "export"
    | "import"
    | "manage";

export interface Permission {
    id: string;
    name: string;
    description: string;
    action: PermissionAction;
}

export interface PermissionGroup {
    id: string;
    name: string;
    icon: string;
    permissions: Permission[];
}

export const PERMISSION_GROUPS: PermissionGroup[] = [
    {
        id: "dashboard",
        name: "Dashboard",
        icon: "LayoutDashboard",
        permissions: [
            { id: "dashboard_view", name: "View Dashboard", description: "Access the main dashboard page", action: "view" },
            { id: "dashboard_stats", name: "View Stats", description: "View summary statistics on dashboard", action: "view" },
        ],
    },
    {
        id: "announcements",
        name: "Announcements",
        icon: "Megaphone",
        permissions: [
            { id: "announcements_view", name: "View Announcements", description: "View announcements list and details", action: "view" },
            { id: "announcements_create", name: "Create Announcements", description: "Publish new announcements", action: "create" },
            { id: "announcements_edit", name: "Edit Announcements", description: "Modify existing announcements", action: "edit" },
            { id: "announcements_delete", name: "Delete Announcements", description: "Remove announcements", action: "delete" },
        ],
    },
    {
        id: "students",
        name: "Student Management",
        icon: "GraduationCap",
        permissions: [
            { id: "students_view", name: "View Students", description: "View student lists", action: "view" },
            { id: "students_create", name: "Create Students", description: "Enroll new students", action: "create" },
            { id: "students_edit", name: "Edit Students", description: "Modify student details", action: "edit" },
            { id: "students_delete", name: "Delete Students", description: "Remove students", action: "delete" },
        ],
    },
    {
        id: "staff",
        name: "Staff Management",
        icon: "Users",
        permissions: [
            { id: "staffs_view", name: "View Staff", description: "View staff lists", action: "view" },
            { id: "staffs_create", name: "Create Staff", description: "Enroll new staff members", action: "create" },
            { id: "staffs_edit", name: "Edit Staff", description: "Modify staff details", action: "edit" },
            { id: "staffs_delete", name: "Delete Staff", description: "Remove staff members", action: "delete" },
        ],
    },
    {
        id: "academic",
        name: "Academic Management",
        icon: "BookOpen",
        permissions: [
            { id: "programs_view", name: "View Programs", description: "View academic programs list", action: "view" },
            { id: "programs_create", name: "Create Programs", description: "Add new academic programs", action: "create" },
            { id: "programs_edit", name: "Edit Programs", description: "Modify existing programs", action: "edit" },
            { id: "programs_delete", name: "Delete Programs", description: "Remove academic programs", action: "delete" },
            { id: "courses_view", name: "View Courses", description: "View courses list", action: "view" },
            { id: "courses_create", name: "Create Courses", description: "Add new courses", action: "create" },
            { id: "courses_edit", name: "Edit Courses", description: "Modify existing courses", action: "edit" },
            { id: "courses_delete", name: "Delete Courses", description: "Remove courses", action: "delete" },
        ],
    },
    {
        id: "users",
        name: "Account Management",
        icon: "UserCog",
        permissions: [
            { id: "users_view", name: "View Accounts", description: "View system user accounts", action: "view" },
            { id: "users_create", name: "Create Accounts", description: "Provision new user accounts", action: "create" },
            { id: "users_edit", name: "Edit Accounts", description: "Modify user account details", action: "edit" },
            { id: "users_delete", name: "Delete Accounts", description: "Remove user accounts", action: "delete" },
        ],
    },
    {
        id: "calendar",
        name: "Calendar Management",
        icon: "CalendarDays",
        permissions: [
            { id: "calendar_view", name: "View Calendar", description: "View the system calendar", action: "view" },
            { id: "calendar_manage", name: "Manage Events", description: "Create, edit, or delete events", action: "manage" },
        ],
    },
    {
        id: "profile",
        name: "User Profile",
        icon: "User",
        permissions: [
            { id: "profile_view", name: "View Profile", description: "Access personal profile page", action: "view" },
            { id: "profile_edit", name: "Edit Profile", description: "Modify personal profile details", action: "edit" },
            { id: "password_change", name: "Security Settings", description: "Change account password", action: "edit" },
        ],
    },
    {
        id: "administration",
        name: "System Security",
        icon: "ShieldAlert",
        permissions: [
            { id: "access_control_manage", name: "Manage Authorities", description: "Grant or revoke user authorities", action: "manage" },
        ],
    },
];

export type RolePermissions = Record<string, string[]>;

export const DEFAULT_ROLE_PERMISSIONS: RolePermissions = {
    admin: [
        "dashboard_view", "dashboard_stats",
        "announcements_view", "announcements_create", "announcements_edit", "announcements_delete",
        "programs_view", "programs_create", "programs_edit", "programs_delete",
        "courses_view", "courses_create", "courses_edit", "courses_delete",
        "users_view", "users_create", "users_edit", "users_delete",
        "students_view", "students_create", "students_edit", "students_delete",
        "staffs_view", "staffs_create", "staffs_edit", "staffs_delete",
        "profile_view", "profile_edit", "password_change",
        "calendar_view", "calendar_manage",
        "access_control_manage",
    ],
    staff: [
        "dashboard_view", "dashboard_stats",
        "announcements_view",
        "users_view",
        "profile_view", "password_change",
        "calendar_view",
    ],
    student: [
        "dashboard_view",
        "announcements_view",
        "courses_view",
        "profile_view", "password_change",
        "calendar_view",
    ],
    teacher: [
        "dashboard_view", "dashboard_stats",
        "announcements_view",
        "courses_view",
        "profile_view", "password_change",
        "calendar_view", "calendar_manage",
    ],
};

