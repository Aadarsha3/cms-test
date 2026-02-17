import { LucideIcon } from "lucide-react";

export interface Announcement {
    id: number;
    title: string;
    date: string;
    content?: string;
    isEveryone?: boolean;
    targetRoles: string[];
    targetDepartments: string[];
    targetPrograms: string[];
    targetGroups: string[];
}

export interface StatItem {
    title: string;
    value: string;
    icon: LucideIcon;
}

export interface DashboardStats {
    admin: StatItem[];
    super_admin: StatItem[];
    staff: StatItem[];
    student: StatItem[];
    teacher: StatItem[];
}

export interface RecentActivity {
    id: number;
    message: string;
    time: string;
}

export interface AnnouncementForm {
    title: string;
    content: string;
    isEveryone: boolean;
    targetRoles: string[];
    targetDepartments: string[];
    targetPrograms: string[];
    targetGroups: string[];
}
