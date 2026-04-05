import { useManagementList } from "@/hooks/useManagementList";
import { UserPlus } from "lucide-react";
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
import { useLocation } from "wouter";
import { roleLabels } from "@/pages/users/user.types";

interface StaffResponse {
  id: string;
  fullName: string;
  email: string;
  designation: string;
  gender: string;
  phoneNumber: string;
}

export function StaffTable() {
  const [, setLocation] = useLocation();
  const {
    data: staffs,
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
  } = useManagementList<StaffResponse>({
    endpoint: "/staffs",
    idField: "id",
  });

  const filteredStaffs = staffs.filter((s) => {
    if (!s) return false;
    const searchLower = search.toLowerCase();
    return (
      (s.fullName?.toLowerCase() || "").includes(searchLower) ||
      (s.email?.toLowerCase() || "").includes(searchLower) ||
      (s.designation?.toLowerCase() || "").includes(searchLower) ||
      (s.phoneNumber?.toLowerCase() || "").includes(searchLower)
    );
  });

  const openStaffDetails = (staffId: string) => {
    setLocation(`/staff/${staffId}`);
  };

  return (
    <div className="space-y-6">
      <TableActionBar
        search={search}
        setSearch={setSearch}
        searchPlaceholder="Search by name, email, or designation..."
        size={size}
        setSize={setSize}
        onRefresh={refresh}
        refreshing={loading}
        actionButton={{
          label: "Enroll Staff",
          icon: UserPlus,
          onClick: () => setLocation("/users/enroll?context=staff"),
          testId: "button-enroll-staff",
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
                <TableHead>Designation</TableHead>
                <TableHead className="w-[120px]">Gender</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableLoadingState colSpan={5} />
              ) : filteredStaffs.length === 0 ? (
                <TableEmptyState
                  colSpan={5}
                  error={error}
                  message="No matching staff members found."
                />
              ) : (
                filteredStaffs.map((staff, index) => (
                  <TableRow
                    key={staff.id || index}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => openStaffDetails(staff.id)}
                  >
                    <TableCell className="text-muted-foreground">{page * size + index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {staff.fullName || "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{staff.email || "N/A"}</TableCell>
                    <TableCell>
                      <span className="text-primary font-medium text-sm">
                        {roleLabels[staff.designation.toLowerCase()] || staff.designation}
                      </span>
                    </TableCell>
                    <TableCell className="capitalize text-muted-foreground">
                      {staff.gender || "-"}
                    </TableCell>
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
        itemsLength={staffs.length}
        totalElements={totalElements}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        loading={loading}
      />
    </div>
  );
}

