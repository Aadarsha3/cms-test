import { useManagementList } from "@/hooks/useManagementList";
import { useLocation } from "wouter";
import { StudentsView } from "./StudentsView";

interface StudentResponse {
  userId: string;
  fullName: string;
  email: string;
  dateOfBirth: string;
  phoneNumber: string;
  presentAddress: string;
  gender: string;
}

export function StudentsPage() {
  const [, setLocation] = useLocation();
  const {
    data: students,
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
  } = useManagementList<StudentResponse>({
    endpoint: "/students",
    idField: "userId",
  });

  const filteredStudents = students.filter((s) => {
    if (!s) return false;
    const searchLower = search.toLowerCase();
    return (
      (s.fullName?.toLowerCase() || "").includes(searchLower) ||
      (s.email?.toLowerCase() || "").includes(searchLower) ||
      (s.userId?.toLowerCase() || "").includes(searchLower) ||
      (s.phoneNumber?.toLowerCase() || "").includes(searchLower)
    );
  });

  return (
    <StudentsView
      students={students}
      filteredStudents={filteredStudents}
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
      onEnroll={() => setLocation("/users/enroll?context=student")}
      onRowClick={(id) => setLocation(`/student/${id}`)}
    />
  );
}
