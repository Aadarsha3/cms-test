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
        id: "programs",
        name: "Academic Programs",
        icon: "GraduationCap",
        permissions: [
            { id: "programs_view", name: "View Programs", description: "View academic programs list", action: "view" },
            { id: "programs_create", name: "Create Programs", description: "Add new academic programs", action: "create" },
            { id: "programs_edit", name: "Edit Programs", description: "Modify existing programs", action: "edit" },
            { id: "programs_delete", name: "Delete Programs", description: "Remove academic programs", action: "delete" },
        ],
    },
    {
        id: "courses",
        name: "Courses",
        icon: "BookOpen",
        permissions: [
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
            { id: "users_create", name: "Enroll Users", description: "Enroll new users", action: "create" },
            { id: "users_edit", name: "Edit Users", description: "Modify user details", action: "edit" },
            { id: "users_delete", name: "Delete Users", description: "Remove users from system", action: "delete" },
            { id: "users_export", name: "Export Users", description: "Export user data to Excel/CSV", action: "export" },
        ],
    },
    {
        id: "attendance",
        name: "Attendance",
        icon: "ClipboardCheck",
        permissions: [
            { id: "attendance_view", name: "View Attendance", description: "View attendance records", action: "view" },
            { id: "attendance_mark", name: "Mark Attendance", description: "Record daily attendance", action: "create" },
            { id: "attendance_report", name: "Download Reports", description: "Download attendance summaries", action: "export" },
        ],
    },
    {
        id: "results",
        name: "Results",
        icon: "FileBarChart",
        permissions: [
            { id: "results_view", name: "View Results", description: "View exam results", action: "view" },
            { id: "results_publish", name: "Publish Results", description: "Publish and notify results", action: "manage" },
            { id: "results_edit", name: "Modify Grades", description: "Edit student marks/grades", action: "edit" },
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
        id: "finance",
        name: "Finance",
        icon: "CreditCard",
        permissions: [
            { id: "fees_view", name: "View Fees", description: "View personal or student fees", action: "view" },
            { id: "fees_manage", name: "Manage Fees", description: "Collect and record fee payments", action: "manage" },
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
            { id: "departments_manage", name: "Manage Departments", description: "Add/Edit university departments", action: "manage" },
            { id: "groups_manage", name: "Manage Groups", description: "Access Groups & Orgs management", action: "manage" },
        ],
    },
];

export type RolePermissions = Record<string, string[]>; // role -> permission_ids[]

export const DEFAULT_ROLE_PERMISSIONS: RolePermissions = {
    super_admin: PERMISSION_GROUPS.flatMap(g => g.permissions.map(p => p.id)),
    admin: [
        "dashboard_view", "dashboard_stats", "announcement_create",
        "programs_view", "programs_create", "programs_edit",
        "courses_view", "courses_create", "courses_edit",
        "users_view", "users_create", "users_edit",
        "attendance_view", "attendance_mark", "attendance_report",
        "results_view", "results_publish",
        "fees_view", "fees_manage",
        "calendar_view", "routine_view", "routine_manage",
        "profile_view", "profile_edit", "password_change"
    ],
    staff: [
        "dashboard_view",
        "courses_view", "syllabus_upload",
        "users_view",
        "attendance_view", "attendance_mark",
        "results_view", "results_edit",
        "calendar_view", "routine_view",
        "profile_view", "password_change"
    ],
    student: [
        "dashboard_view",
        "courses_view",
        "attendance_view",
        "results_view",
        "fees_view",
        "calendar_view", "routine_view",
        "profile_view", "password_change"
    ],
    teacher: [
        "dashboard_view",
        "courses_view", "syllabus_upload",
        "attendance_view", "attendance_mark",
        "results_view", "results_edit",
        "calendar_view", "routine_view",
        "profile_view", "password_change"
    ],
    student_council_member: [
        "dashboard_view",
        "courses_view",
        "attendance_view",
        "results_view",
        "fees_view",
        "calendar_view", "routine_view",
        "profile_view", "password_change"
    ],
    sports_committee_member: [
        "dashboard_view",
        "courses_view",
        "attendance_view",
        "results_view",
        "fees_view",
        "calendar_view", "routine_view",
        "profile_view", "password_change"
    ],
};
