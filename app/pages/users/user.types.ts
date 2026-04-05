export interface UserDetail {
    id: string;
    username: string;
    primaryEmail: string;
    givenName?: string;
    familyName?: string;
    createdAt?: string | number[];
    createdTimestamp?: number;
    role?: string;
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

export interface StudentDetail {
    id: string;
    userId?: string;
    username?: string;
    fullName: string;
    email: string;
    dateOfBirth: string;
    phoneNumber: string;
    presentAddress: string;
    gender: string;
    guardianName: string;
    guardianPhoneNumber: string;
    guardianRelation: string;
    primaryEmail?: string;
    userAccountId?: string;
    accountCreatedDate?: string;
}

export interface StudentFormData {
    dateOfBirth: string;
    gender: string;
    presentAddress: string;
    phoneNumber: string;
    guardianName: string;
    guardianPhoneNumber: string;
    guardianRelation: string;
}

export interface StaffDetail {
    id: string;
    userId?: string;
    user?: string;
    username?: string;
    fullName: string;
    email: string;
    dateOfBirth: string;
    gender: string;
    address: string;
    phoneNumber: string;
    designation: string;
    joinDate: string;
    terminationDate: string | null;
    primaryEmail?: string;
    userAccountId?: string;
    accountCreatedDate?: string;
}

export interface StaffFormData {
    dateOfBirth: string;
    gender: string;
    address: string;
    phoneNumber: string;
    designation: string;
    joinDate: string;
}

export interface AccountFormData {
    firstName: string;
    lastName: string;
    userId: string;
    email: string;
    password: string;
    joinDate: string;
}

export interface ProfileFormData {
    role: string;
    group?: { id: string; name: string };
    subRoles: string[];
    phone: string;
    status: "active" | "inactive";
}

export const roleLabels: Record<string, string> = {
    admin: "Admin",
    staff: "Staff",
    student: "Student",
    teacher: "Teacher",
};

export const roleColors: Record<string, string> = {
    admin: "bg-destructive text-destructive-foreground",
    staff: "bg-primary text-primary-foreground",
    student: "bg-primary text-primary-foreground",
    teacher: "bg-amber-500 text-white",
};
