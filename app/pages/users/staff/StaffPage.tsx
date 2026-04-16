import { useManagementList } from "@/hooks/useManagementList";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { StaffView } from "./StaffView";

interface StaffResponse {
  id: string;
  fullName: string;
  email: string;
  designation: string;
  gender: string;
  phoneNumber: string;
}

export function StaffPage() {
  const [, setLocation] = useLocation();
  const { hasPermission } = useAuth();
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

  const filteredStaffs = staffs.filter((s: StaffResponse) => {
    if (!s) return false;
    const searchLower = search.toLowerCase();
    return (
      (s.fullName?.toLowerCase() || "").includes(searchLower) ||
      (s.email?.toLowerCase() || "").includes(searchLower) ||
      (s.designation?.toLowerCase() || "").includes(searchLower) ||
      (s.phoneNumber?.toLowerCase() || "").includes(searchLower)
    );
  });

  return (
    <StaffView
      staffs={staffs}
      filteredStaffs={filteredStaffs}
      loading={loading}
      totalElements={totalElements}
      error={error}
      search={search}
      setSearch={setSearch}
      page={page}
      size={size}
      setSize={setSize}
      handleNextPage={handleNextPage}
      handlePrevPage={handlePrevPage}
      refresh={refresh}
      onEnroll={() => setLocation("/users/enroll?context=staff")}
      onRowClick={(id) => setLocation(`/staff/${id}`)}
      hasPermission={hasPermission}
    />
  );
}
