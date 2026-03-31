import { useState, useEffect } from "react";
import { dashboardApi } from "@/lib/api";
import { UserPlus, Search, Loader2, RefreshCw } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface StudentResponse {
  userId: string;
  fullName: string;
  email: string;
  dateOfBirth: string;
  phoneNumber: string;
  presentAddress: string;
  gender: string;
  guardianName: string;
  guardianPhoneNumber: string;
  guardianRelation: string;
}

export function StudentTable() {
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [localSearch, setLocalSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sort] = useState("userId");
  const [direction] = useState("DESC");

  const { toast } = useToast();
  const [, setLocation] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => setSearch(localSearch), 300);
    return () => clearTimeout(timer);
  }, [localSearch]);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { page, size, sort, direction };
      const response = await dashboardApi.get<StudentResponse[]>("/students", {
        params,
      });

      if (Array.isArray(response.data)) {
        setStudents(response.data);
        setTotalElements(response.data.length);
      } else {
        const data = response.data as any;
        if (data && Array.isArray(data.content)) {
          setStudents(data.content);
          setTotalElements(data.totalElements || data.content.length);
        } else {
          console.warn("Unexpected API response format:", response.data);
          setStudents([]);
          setTotalElements(0);
          setError("Invalid response format from server");
        }
      }
    } catch (err: any) {
      console.error("Failed to fetch students:", err);
      setError(err.message || "Failed to load students");
      toast({
        title: "Error fetching students",
        description: err.message || "Could not connect to the server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, size, sort, direction]);

  const filteredStudents = students.filter((s) => {
    if (!s) return false;
    const searchLower = search.toLowerCase();
    const fullName = s.fullName?.toLowerCase() || "";
    const email = s.email?.toLowerCase() || "";
    const userId = s.userId?.toLowerCase() || "";
    const phone = s.phoneNumber?.toLowerCase() || "";

    return (
      fullName.includes(searchLower) ||
      email.includes(searchLower) ||
      userId.includes(searchLower) ||
      phone.includes(searchLower)
    );
  });

  const openStudentDetails = (studentId: string) => {
    setLocation(`/student/${studentId}`);
  };

  const handleNextPage = () => {
    if (students.length === size) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage((prev) => prev - 1);
    }
  };

  useEffect(() => {
    setPage(0);
  }, [search]);

  return (
    <MainLayout title="Student Management">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="student-search-query"
              placeholder="Search by name, email, or phone..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-9 h-11 bg-white dark:bg-zinc-950 border-[#243F76]/10 dark:border-white/10 shadow-sm"
              autoComplete="off"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden lg:inline">
                Rows:
              </span>
              <Select
                value={String(size)}
                onValueChange={(v) => {
                  setSize(Number(v));
                  setPage(0);
                }}
              >
                <SelectTrigger className="h-11 w-[85px] bg-white dark:bg-zinc-950 border-[#243F76]/10 dark:border-white/10 shadow-sm">
                  <SelectValue placeholder={String(size)} />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 20, 50, 100].map((v) => (
                    <SelectItem key={v} value={String(v)}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={fetchStudents}
              className="h-11 w-11 shrink-0"
              title="Refresh List"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
            <Button
              onClick={() =>
                setLocation("/users/enroll?context=student")
              }
              className="gap-2 h-11 px-6 shadow-md hover:shadow-lg transition-all"
            >
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Enroll Student</span>
              <span className="sm:hidden">Enroll</span>
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">SN</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Gender</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Loading...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {error ? (
                        <span className="text-destructive">
                          Failed to load data.
                        </span>
                      ) : (
                        "No matching students found."
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student, index) => (
                    <TableRow
                      key={student.userId || index}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => {
                        const targetId = student.userId || (student as any).id || (student as any).studentId;
                        if (targetId) {
                          openStudentDetails(targetId);
                        } else {
                          const keys = Object.keys(student).join(', ');
                          toast({ title: "Missing ID", description: `Fields returned by API: ${keys}. No id found.`, variant: "destructive", duration: 10000 });
                          console.error("Clicked student has no ID:", student);
                        }
                      }}
                    >
                      <TableCell>{page * size + index + 1}</TableCell>
                      <TableCell className="font-medium">
                        {student.fullName || "-"}
                      </TableCell>
                      <TableCell>{student.email || "N/A"}</TableCell>
                      <TableCell>{student.phoneNumber || "-"}</TableCell>
                      <TableCell className="capitalize">
                        {student.gender || "-"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {!loading && students.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {page * size + 1}-{page * size + students.length} of{" "}
              {totalElements} entries
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={page === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={students.length < size}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
