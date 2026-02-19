export interface UserDetail {
    id: string;
    username: string;
    primaryEmail: string;
    givenName?: string;
    familyName?: string;
    createdAt?: string;
    role?: string;
    department?: string;
    status?: string;
    phone?: string;
    User_Id?: string;
    avatarUrl?: string;
    subRoles?: string[];
    universityId?: string;
    dateOfBirth?: string;
    gender?: string;
    currentClass?: string;
    semester?: string;
    guardianName?: string;
    guardianContact?: string;
    guardianRelationship?: string;
    enrollmentDate?: string;
    documents?: any[];
}

export interface StudentFormData {
    universityId: string;
    dateOfBirth: string;
    gender: string;
    currentClass: string;
    semester: string;
    guardianName: string;
    guardianContact: string;
    guardianRelationship: string;
}

export interface AccountFormData {
    firstName: string;
    lastName: string;
    userId: string;
    email: string;
    password: string;
}

export interface ProfileFormData {
    role: string;
    subRoles: string[];
    department: string;
    phone: string;
    status: "active" | "inactive";
}

export const roleLabels: Record<string, string> = {
    super_admin: "Super Admin",
    admin: "Admin",
    staff: "Staff",
    student: "Student",
    teacher: "Teacher",
    student_council_president: "Student Council President",
    student_council_member: "Student Council Member",
    sports_committee_member: "Sports Committee Member",
};

export const roleColors: Record<string, string> = {
    super_admin: "bg-destructive text-destructive-foreground",
    admin: "bg-primary text-primary-foreground",
    staff: "bg-secondary text-secondary-foreground",
    student: "bg-muted text-muted-foreground",
    teacher: "bg-amber-500 text-white",
    student_council_president: "bg-indigo-500 text-white",
    student_council_member: "bg-indigo-400 text-white",
    sports_committee_member: "bg-emerald-500 text-white",
};
