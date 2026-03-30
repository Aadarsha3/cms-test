// /app/src/pages/sidebar/course_management/CourseTable.tsx

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
  creditHour: string;
}

interface PaginatedResponse {
  content: CourseResponse[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export function CourseTable() {
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {
        page,
        size,
        sort: "id",
        direction: "DESC",
      };

      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }

      const response = await dashboardApi.get<PaginatedResponse>("/courses", {
        params,
      });

      if (response.data?.content && Array.isArray(response.data.content)) {
        setCourses(response.data.content);
        setTotalElements(response.data.totalElements || response.data.content.length);
        setTotalPages(response.data.totalPages || 1);
      } else if (Array.isArray(response.data)) {
        setCourses(response.data);
        setTotalElements(response.data.length);
        setTotalPages(1);
      } else {
        console.warn("Unexpected API response format:", response.data);
        setCourses([]);
        setTotalElements(0);
        setTotalPages(0);
        setError("Invalid response format from server");
      }
    } catch (err: any) {
      console.error("Failed to fetch courses:", err);
      const errorMsg = err.message || "Failed to load courses";
      setError(errorMsg);
      setCourses([]);
      setTotalElements(0);

      toast({
        title: "Error fetching courses",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [page, size, debouncedSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(0);
  }, [search]);

  const handleNextPage = () => {
    const currentPageEnd = (page + 1) * size;
    if (currentPageEnd < totalElements) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage((prev) => prev - 1);
    }
  };

  const displayStart = totalElements === 0 ? 0 : page * size + 1;
  const displayEnd = Math.min((page + 1) * size, totalElements);
  const isLastPage = displayEnd >= totalElements;

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
              disabled={loading}
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
                  <TableHead>Credits</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Loading...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-destructive"
                    >
                      Failed to load data. Please try again.
                    </TableCell>
                  </TableRow>
                ) : courses.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {search ? "No matching courses found." : "No courses created yet."}
                    </TableCell>
                  </TableRow>
                ) : (
                  courses.map((course, index) => (
                    <TableRow
                      key={course.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
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
                      <TableCell>
                        {course.creditHour || "0"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {!loading && courses.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Showing {displayStart}-{displayEnd} of {totalElements} entries
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={page === 0 || loading}
              >
                Previous
              </Button>

              <div className="flex items-center gap-2 px-3 py-1 text-sm text-muted-foreground">
                Page {page + 1} of {totalPages || 1}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={isLastPage || loading}
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
