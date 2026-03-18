import { UserTable } from "../components/UserTable";

export function TeachersPage() {
    return (
        <UserTable 
            title="Teacher Management" 
            roleFilter="teacher" 
            enrollLabel="Enroll Teacher"
            enrollPath="/users/enroll?context=teacher"
        />
    );
}
