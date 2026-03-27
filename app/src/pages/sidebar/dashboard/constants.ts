// /app/src/pages/sidebar/dashboard/constants.ts

import { Users, GraduationCap, BookOpen, ClipboardCheck, TrendingUp, FileText, CreditCard } from "lucide-react";
import { DashboardStats } from "./types";

export const initialStats: DashboardStats = {
    admin: [
        { title: "Total Students", value: "0", icon: Users },
        { title: "Active Programs", value: "0", icon: GraduationCap },
        { title: "Courses", value: "0", icon: BookOpen },
    ],
    super_admin: [
        { title: "Total Students", value: "0", icon: Users },
        { title: "Active Programs", value: "0", icon: GraduationCap },
        { title: "Courses", value: "0", icon: BookOpen },
    ],
    staff: [
        { title: "My Students", value: "0", icon: Users },
        { title: "Courses Teaching", value: "0", icon: BookOpen },
        { title: "Avg. Attendance", value: "0%", icon: ClipboardCheck },
        { title: "Pending Grades", value: "0", icon: FileText },
    ],
    student: [
        { title: "Enrolled Courses", value: "0", icon: BookOpen },
        { title: "Attendance Rate", value: "0%", icon: ClipboardCheck },
        { title: "Current GPA", value: "0.0", icon: TrendingUp },
        { title: "Pending Fees", value: "Rs. 0", icon: CreditCard },
    ],
    teacher: [
        { title: "My Students", value: "0", icon: Users },
        { title: "Courses Teaching", value: "0", icon: BookOpen },
        { title: "Avg. Attendance", value: "0%", icon: ClipboardCheck },
        { title: "Pending Grades", value: "0", icon: FileText },
    ],
};

export const availableRoles = [
    { id: "all", label: "All Roles" },
    { id: "student", label: "Students" },
    { id: "staff", label: "Staff Member" },
    { id: "admin", label: "Admins" },
];

export const availablePrograms = [
    { id: "Bachelor of Computer Science", label: "Bachelor of Computer Science" },
    { id: "Bachelor of Information Technology", label: "Bachelor of Information Technology" },
    { id: "Master of Business Administration", label: "Master of Business Administration" },
    { id: "Bachelor of Mechanical Engineering", label: "Bachelor of Mechanical Engineering" },
    { id: "Doctor of Philosophy in Physics", label: "Doctor of Philosophy in Physics" },
];

export const availableGroups = [
    { id: "all", label: "All Groups" },
    { id: "Section A", label: "Section A" },
    { id: "Section B", label: "Section B" },
    { id: "Morning Batch", label: "Morning Batch" },
    { id: "Evening Batch", label: "Evening Batch" },
];
