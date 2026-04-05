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
            { id: "announcement_create", name: "Create Announcements", description: "Create new dashboard announcements", action: "create" },
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
            { id: "syllabus_upload", name: "Upload Syllabus", description: "Upload course syllabus documents", action: "create" },
        ],
    },
    {
        id: "users",
        name: "User Management",
        icon: "Users",
        permissions: [
            { id: "users_view", name: "View Users", description: "View all users (admin/staff/student)", action: "view" },
            { id: "users_create", name: "Enroll Users", description: "Enroll or create new users", action: "create" },
            { id: "users_edit", name: "Edit Users", description: "Modify user accounts and details", action: "edit" },
            { id: "users_delete", name: "Delete Users", description: "Remove users from system", action: "delete" },
            { id: "users_export", name: "Export Users", description: "Export user data to Excel/CSV", action: "export" },
            { id: "students_view", name: "View Student List", description: "View the primary student directory", action: "view" },
            { id: "students_edit", name: "Edit Student Records", description: "Modify specific student enrollment data", action: "edit" },
        ],
    },
    {
        id: "profile",
        name: "Profile",
        icon: "User",
        permissions: [
            { id: "profile_view", name: "View Own Profile", description: "Access personal profile page", action: "view" },
            { id: "profile_edit", name: "Edit Own Profile", description: "Modify personal profile details", action: "edit" },
            { id: "password_change", name: "Change Password", description: "Change account password", action: "edit" },
        ],
    },
    {
        id: "schedule",
        name: "Schedule & Calendar",
        icon: "CalendarDays",
        permissions: [
            { id: "calendar_view", name: "View Calendar", description: "View academic calendar", action: "view" },
            { id: "routine_view", name: "View Routine", description: "View class routine/timetable", action: "view" },
            { id: "routine_manage", name: "Manage Schedule", description: "Update class timings and routine", action: "manage" },
        ],
    },
    {
        id: "settings",
        name: "Settings",
        icon: "Settings",
        permissions: [
            { id: "settings_manage", name: "Manage System Settings", description: "Access system configuration", action: "manage" },
            { id: "permissions_manage", name: "Manage Permissions", description: "Configure role-based access", action: "manage" },
        ],
    },
];

export type RolePermissions = Record<string, string[]>; 
// role -> permission_ids[]

export const DEFAULT_ROLE_PERMISSIONS: RolePermissions = {
    admin: [
        "dashboard_view", "dashboard_stats", "announcement_create",
        "programs_view", "programs_create", "programs_edit", "programs_delete",
        "courses_view", "courses_create", "courses_edit", "courses_delete", "syllabus_upload",
        "users_view", "users_create", "users_edit", "users_delete", "users_export",
        "students_view", "students_edit",
        "calendar_view", "routine_view", "routine_manage",
        "profile_view", "profile_edit", "password_change",
        "settings_manage", "permissions_manage"
    ],
    staff: [
        "dashboard_view", "dashboard_stats",
        "programs_view", "courses_view", "syllabus_upload",
        "users_view", "students_view",
        "calendar_view", "routine_view",
        "profile_view", "password_change"
    ],
    student: [
        "dashboard_view",
        "courses_view",
        "calendar_view", "routine_view",
        "profile_view", "password_change"
    ],
    teacher: [
        "dashboard_view", "dashboard_stats",
        "courses_view", "syllabus_upload",
        "students_view",
        "calendar_view", "routine_view",
        "profile_view", "password_change"
    ],
};
