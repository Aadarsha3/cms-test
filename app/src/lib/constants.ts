import { type UserRole } from "@/lib/auth-context";

export const roleLabels: Record<UserRole, string> = {
    super_admin: "Super Admin",
    admin: "Admin",
    staff: "Staff Member",
    student: "Student",
    teacher: "Teacher",
    student_council_president: "Student Council President",
    student_council_member: "Student Council Member",
    sports_committee_member: "Sports Committee Member",
};

export const roleColors: Record<UserRole, string> = {
    super_admin: "bg-destructive text-destructive-foreground",
    admin: "bg-primary text-primary-foreground",
    staff: "bg-primary text-primary-foreground",
    student: "bg-primary text-primary-foreground",
    teacher: "bg-primary text-primary-foreground",
    student_council_president: "bg-primary text-primary-foreground",
    student_council_member: "bg-primary text-primary-foreground",
    sports_committee_member: "bg-primary text-primary-foreground",
};
