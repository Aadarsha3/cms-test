import { UserTable } from "../components/UserTable";

export function StaffPage() {
    return (
        <UserTable 
            title="Staff Management" 
            roleFilter="staff,admin" 
            enrollLabel="Enroll Staff"
            enrollPath="/users/enroll?context=staff"
        />
    );
}
