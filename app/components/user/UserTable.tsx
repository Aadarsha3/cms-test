import { useManagementList } from "@/hooks/useManagementList";
import { userApi } from "@/lib/api";
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
import { useLocation } from "wouter";
import { roleLabels } from "@/pages/users/user.types";

interface UserResponse {
  id: string;
  primaryEmail: string;
  username: string;
  givenName: string;
  familyName: string;
  gender?: string;
  role?: string;
  group?: { id: string; name: string };
}

interface UserTableProps {
  title: string;
  roleFilter?: string;
  enrollPath?: string;
  enrollLabel?: string;
}

export function UserTable({
  title,
  roleFilter,
  enrollPath = "/users/enroll",
  enrollLabel = "Enroll User",
}: UserTableProps) {
  const [, setLocation] = useLocation();

  const {
    data: apiUsers,
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
  } = useManagementList<UserResponse>({
    endpoint: "/users",
    apiInstance: userApi,
    extraParams: roleFilter ? { role: roleFilter } : {},
  });

  const filteredUsers = apiUsers.filter((u) => {
    if (!u) return false;
    const searchLower = search.toLowerCase();
    const fullName = `${u.givenName || ""} ${u.familyName || ""}`.toLowerCase();
    return (
      (u.username?.toLowerCase() || "").includes(searchLower) ||
      (u.primaryEmail?.toLowerCase() || "").includes(searchLower) ||
      (u.id?.toLowerCase() || "").includes(searchLower) ||
      fullName.includes(searchLower)
    );
  });

  const openUserDetails = (userId: string) => {
    let from = "dashboard";
    if (roleFilter === "student") from = "students";
    else if (roleFilter === "teacher") from = "teachers";
    else if (roleFilter === "staff,admin") from = "staff";
    setLocation(`/users/${userId}?from=${from}`);
  };

  return (
    <MainLayout title={title}>
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
            label: enrollLabel,
            icon: UserPlus,
            onClick: () => setLocation(enrollPath),
            testId: "button-enroll-user",
          }}
        />

        <Card className="border-border/50 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[80px]">SN</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email Address</TableHead>
                  <TableHead>Role/Group</TableHead>
                  <TableHead className="w-[120px] text-center">Gender</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableLoadingState colSpan={6} />
                ) : filteredUsers.length === 0 ? (
                  <TableEmptyState
                    colSpan={6}
                    error={error}
                    message="No matching users found."
                  />
                ) : (
                  filteredUsers.map((user, index) => (
                    <TableRow
                      key={user.id || index}
                      className="cursor-pointer hover:bg-muted/50 transition-colors group"
                      onClick={() => openUserDetails(user.id)}
                    >
                      <TableCell className="text-muted-foreground font-mono text-xs">{page * size + index + 1}</TableCell>
                      <TableCell className="font-semibold group-hover:text-primary transition-colors">
                        {`${user.givenName || ""} ${user.familyName || ""}`.trim() || "-"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.username || "N/A"}</TableCell>
                      <TableCell className="text-muted-foreground truncate max-w-[200px]">{user.primaryEmail || "N/A"}</TableCell>
                      <TableCell>
                        <span className="text-primary font-medium text-sm">
                          {user.group?.name || (user.role ? (roleLabels[user.role] || user.role) : "-")}
                        </span>
                      </TableCell>
                      <TableCell className="capitalize text-center text-muted-foreground font-medium">
                        {user.gender || "-"}
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
          itemsLength={apiUsers.length}
          totalElements={totalElements}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
          loading={loading}
        />
      </div>
    </MainLayout>
  );
}

