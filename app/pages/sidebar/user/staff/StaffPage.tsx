import { UserTable } from "@/components/features/user/UserTable";

export function StaffPage() {
    return (
        <UserTable
            title="Staff Management"
            roleFilter="staff,admin,teacher"
            enrollLabel="Enroll Staff"
            enrollPath="/users/enroll?context=staff"
        />
    );
}
