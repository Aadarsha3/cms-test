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

export type DashboardStats = StatItem[];

export interface AnnouncementForm {
    title: string;
    details: string;
}
