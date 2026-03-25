import { type UserRole } from "@/lib/auth-context";

export const roleLabels: Record<UserRole, string> = {
    super_admin: "Super Admin",
    admin: "Admin",
    staff: "Staff Member",
    student: "Student",
    teacher: "Teacher",
};

export const roleColors: Record<UserRole, string> = {
    super_admin: "bg-destructive text-destructive-foreground",
    admin: "bg-primary text-primary-foreground",
    staff: "bg-primary text-primary-foreground",
    student: "bg-primary text-primary-foreground",
    teacher: "bg-primary text-primary-foreground",
};

export const PROGRAM_DURATIONS = [
  { label: "1 Year", value: "1 year" },
  { label: "2 Years", value: "2 year" },
  { label: "3 Years", value: "3 year" },
  { label: "4 Years", value: "4 year" },
  { label: "5 Years", value: "5 year" },
  { label: "6 Years", value: "6 year" },
  { label: "2 Semesters", value: "2 sem" },
  { label: "4 Semesters", value: "4 sem" },
  { label: "6 Semesters", value: "6 sem" },
  { label: "8 Semesters", value: "8 sem" },
] as const;

export const PROGRAM_TYPES = [
  { label: "Bachelor", value: "BACHELOR" },
  { label: "Master", value: "MASTER" },
] as const;

export type ProgramDurationValue = typeof PROGRAM_DURATIONS[number]["value"];
export type ProgramTypeValue = typeof PROGRAM_TYPES[number]["value"];
