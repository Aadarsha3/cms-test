import { useState, useEffect } from "react";
import { dashboardApi } from "@/lib/api";
import { Plus, Search, Loader2, RefreshCw, BookOpen } from "lucide-react";
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

interface CourseResponse {
  id: string;
  name: string;
  courseCode: string;
  creditHours: number;
  description?: string;
  programId?: string;
  semester?: string;
}

interface Program {
  id: string;
  name: string;
}

export function CourseTable() {
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sort] = useState("id");
  const [direction] = useState("DESC");
  const [programs, setPrograms] = useState<Program[]>([]);

  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const fetchPrograms = async () => {
    try {
      const response = await dashboardApi.get("/programs");
      const data = Array.isArray(response.data) ? response.data : 
                   (response.data as any)?.content || [];
      setPrograms(data);
    } catch (err) {
      console.error("Failed to fetch programs:", err);
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { page, size, sort, direction };
      const response = await dashboardApi.get<CourseResponse[]>("/courses", {
        params,
      });

      if (Array.isArray(response.data)) {
        setCourses(response.data);
        setTotalElements(response.data.length);
      } else {
        const data = response.data as any;
        if (data && Array.isArray(data.content)) {
          setCourses(data.content);
          setTotalElements(data.totalElements || data.content.length);
        } else {
          console.warn("Unexpected API response format:", response.data);
          setCourses([]);
          setTotalElements(0);
          setError("Invalid response format from server");
        }
      }
    } catch (err: any) {
      console.error("Failed to fetch courses:", err);
      setError(err.message || "Failed to load courses");
      toast({
        title: "Error fetching courses",
        description: err.message || "Could not connect to the server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchPrograms();
  }, [page, size, sort, direction]);

  const filteredCourses = courses.filter((c) => {
    if (!c) return false;
    const searchLower = search.toLowerCase();
    const name = c.name?.toLowerCase() || "";
    const code = c.courseCode?.toLowerCase() || "";

    return (
      name.includes(searchLower) ||
      code.includes(searchLower)
    );
  });

  const handleNextPage = () => {
    if (courses.length === size) {
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
    <MainLayout title="Course Management">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="course-search-query"
              placeholder="Search by course name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
              onClick={fetchCourses}
              className="h-11 w-11 shrink-0"
              title="Refresh List"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
            <Button
              onClick={() => setLocation("/courses/create")}
              className="gap-2 h-11 px-6 shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Course</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">SN</TableHead>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead>Credits</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Loading...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredCourses.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {error ? (
                        <span className="text-destructive">
                          Failed to load data.
                        </span>
                      ) : (
                        "No matching courses found."
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCourses.map((course, index) => (
                    <TableRow
                      key={course.id || index}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setLocation(`/courses/${course.id}`)}
                    >
                      <TableCell>{page * size + index + 1}</TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="bg-[#243F76]/10 p-2 rounded">
                            <BookOpen className="h-4 w-4 text-[#243F76]" />
                          </div>
                          {course.name || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded font-mono text-xs">
                          {course.courseCode || "-"}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate">
                        {programs.find(p => p.id === course.programId)?.name || "-"}
                      </TableCell>
                      <TableCell>
                        {course.semester || "-"}
                      </TableCell>
                      <TableCell>
                        {course.creditHours || "0"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {!loading && courses.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {page * size + 1}-{page * size + courses.length} of{" "}
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
                disabled={courses.length < size}
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
