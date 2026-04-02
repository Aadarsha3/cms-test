import { LucideIcon } from "lucide-react";

export interface Announcement {
    id: string;
    title: string;
    date: string;
    details?: string;
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
    details: string;
}
