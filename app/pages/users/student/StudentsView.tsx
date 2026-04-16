
import { UserPlus } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePagination } from "@/components/common/TablePagination";
import { TableLoadingState } from "@/components/common/TableLoadingState";
import { TableEmptyState } from "@/components/common/TableEmptyState";
import { TableActionBar } from "@/components/common/TableActionBar";

interface StudentResponse {
  userId: string;
  fullName: string;
  email: string;
  dateOfBirth: string;
  phoneNumber: string;
  presentAddress: string;
  gender: string;
}

interface StudentsViewProps {
  students: StudentResponse[];
  filteredStudents: StudentResponse[];
  loading: boolean;
  totalElements: number;
  error: string | null;
  search: string;
  setSearch: (s: string) => void;
  page: number;
  size: number;
  setSize: (s: number) => void;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  refresh: () => void;
  onEnroll: () => void;
  onRowClick: (id: string) => void;
  hasPermission: (permissionId: string) => boolean;
}

export function StudentsView({
  students,
  filteredStudents,
  loading,
  totalElements,
  error,
  search,
  setSearch,
  page,
  size,
  setSize,
  handleNextPage,
  handlePrevPage,
  refresh,
  onEnroll,
  onRowClick,
  hasPermission,
}: StudentsViewProps) {
  return (
    <MainLayout title="Student Management">
      <div className="space-y-6">
        <TableActionBar
          search={search}
          setSearch={setSearch}
          searchPlaceholder="Search by name, email, or ID..."
          size={size}
          setSize={setSize}
          onRefresh={refresh}
          refreshing={loading}
          actionButton={{
            label: "Enroll Student",
            icon: UserPlus,
            onClick: onEnroll,
            testId: "button-enroll-student",
            hidden: !hasPermission("students_create"),
          }}
        />

        <Card className="border-border/50 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[80px]">SN</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email Address</TableHead>
                  <TableHead className="w-[120px]">Gender</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableLoadingState colSpan={4} />
                ) : filteredStudents.length === 0 ? (
                  <TableEmptyState
                    colSpan={4}
                    error={error}
                    message="No matching students found."
                  />
                ) : (
                  filteredStudents.map((student, index) => (
                    <TableRow
                      key={student.userId || index}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => {
                        const targetId = student.userId || (student as any).id;
                        if (targetId) onRowClick(targetId);
                      }}
                    >
                      <TableCell className="text-muted-foreground">{page * size + index + 1}</TableCell>
                      <TableCell className="font-medium">{student.fullName || "-"}</TableCell>
                      <TableCell className="text-muted-foreground">{student.email || "N/A"}</TableCell>
                      <TableCell className="capitalize">{student.gender || "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <TablePagination
          page={page}
          size={size}
          itemsLength={students.length}
          totalElements={totalElements}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
          loading={loading}
        />
      </div>
    </MainLayout>
  );
}
