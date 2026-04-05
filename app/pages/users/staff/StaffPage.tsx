import { StaffTable } from "@/components/user/StaffTable";
import { MainLayout } from "@/components/layout/MainLayout";

export function StaffPage() {
    return (
        <MainLayout title="Staff Management">
            <StaffTable />
        </MainLayout>
    );
}
