import { UserTable } from "../components/UserTable";

export function StudentsPage() {
    return (
        <UserTable 
            title="Student Management" 
            roleFilter="student" 
            enrollLabel="Enroll Student"
            enrollPath="/users/enroll?context=student"
        />
    );
}
