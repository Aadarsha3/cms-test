import React from "react";
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
import { roleLabels } from "@/pages/users/user.types";

interface StaffResponse {
  id: string;
  fullName: string;
  email: string;
  designation: string;
  gender: string;
  phoneNumber: string;
}

interface StaffViewProps {
  staffs: StaffResponse[];
  filteredStaffs: StaffResponse[];
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
}

export function StaffView({
  staffs,
  filteredStaffs,
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
}: StaffViewProps) {
  return (
    <MainLayout title="Staff Management">
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
            onClick: onEnroll,
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
                      onClick={() => onRowClick(staff.id)}
                    >
                      <TableCell className="text-muted-foreground">{page * size + index + 1}</TableCell>
                      <TableCell className="font-medium">{staff.fullName || "-"}</TableCell>
                      <TableCell className="text-muted-foreground">{staff.email || "N/A"}</TableCell>
                      <TableCell>
                      <span className="text-muted-foreground font-medium text-sm">
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
    </MainLayout>
  );
}
