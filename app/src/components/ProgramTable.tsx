// components/ProgramTable.tsx

import { useState, useEffect } from "react";
import { dashboardApi } from "@/lib/api";
import { Plus, Search, Loader2, RefreshCw, BookOpen, Edit2, Trash2, ChevronRight } from "lucide-react";
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
import { extractErrorMessage, logError } from "@/lib/error-handler";

interface ProgramResponse {
  id: string;
  name: string;
  programCode: string;
  duration: string;
  type?: string;
}

interface PaginatedResponse {
  content: ProgramResponse[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export function ProgramTable() {
  const [programs, setPrograms] = useState<ProgramResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [localSearch, setLocalSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const { toast } = useToast();
  const [, setLocation] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => setSearch(localSearch), 300);
    return () => clearTimeout(timer);
  }, [localSearch]);

  const fetchPrograms = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {
        page,
        size,
        sort: "id",
        direction: "DESC",
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      const response = await dashboardApi.get<PaginatedResponse>("/programs", {
        params,
      });

      if (response.data?.content && Array.isArray(response.data.content)) {
        setPrograms(response.data.content);
        setTotalElements(response.data.totalElements || response.data.content.length);
        setTotalPages(response.data.totalPages || 1);
      } else if (Array.isArray(response.data)) {
        setPrograms(response.data as any);
        setTotalElements((response.data as any).length);
        setTotalPages(1);
      } else {
        console.warn("Unexpected API response format:", response.data);
        setPrograms([]);
        setTotalElements(0);
        setTotalPages(0);
        setError("Invalid response format from server");
      }
    } catch (err: any) {
      logError("FetchPrograms", err);
      const errorMsg = extractErrorMessage(err, "Could not connect to the server");
      setError(errorMsg);
      setPrograms([]);
      setTotalElements(0);

      toast({
        title: "Error fetching programs",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, [page, size, search]);

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

  const handleSizeChange = (newSize: number) => {
    setSize(newSize);
    setPage(0);
  };

  const displayStart = totalElements === 0 ? 0 : page * size + 1;
  const displayEnd = Math.min((page + 1) * size, totalElements);
  const isLastPage = displayEnd >= totalElements;

  return (
    <MainLayout title="Program Management">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="program-search-query"
              placeholder="Search by name, code, or duration..."
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
                onValueChange={(v) => handleSizeChange(Number(v))}
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
              onClick={fetchPrograms}
              className="h-11 w-11 shrink-0"
              title="Refresh List"
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </Button>

            <Button
              onClick={() => setLocation("/programs/create")}
              className="gap-2 h-11 px-6 shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Program</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {loading ? (
             <div className="flex items-center justify-center h-24 text-muted-foreground border border-[#243F76]/10 dark:border-white/10 rounded-lg bg-card dark:bg-transparent shadow-sm">
               <Loader2 className="h-5 w-5 animate-spin mr-2" />
               Loading...
             </div>
          ) : error ? (
            <div className="flex items-center justify-center h-24 text-destructive border border-[#243F76]/10 dark:border-white/10 rounded-lg bg-card dark:bg-transparent shadow-sm">
              Failed to load data. Please try again.
            </div>
          ) : programs.length === 0 ? (
            <div className="flex items-center justify-center h-24 text-muted-foreground border border-[#243F76]/10 dark:border-white/10 rounded-lg bg-card dark:bg-transparent shadow-sm">
              {search ? "No matching programs found." : "No programs created yet."}
            </div>
          ) : (
            programs.map((program) => (
              <div
                key={program.id}
                onClick={() => setLocation(`/programs/${program.id}`)}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-[#243F76]/10 dark:border-white/10 bg-card dark:bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-950 transition-all cursor-pointer shadow-sm hover:shadow-md gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="h-12 w-12 rounded-xl bg-[#243F76]/10 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                    <BookOpen className="h-6 w-6 text-[#243F76] dark:text-blue-400" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h3 className="font-semibold text-base sm:text-lg text-foreground truncate">
                      {program.name || "-"}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      {program.type && (
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500 text-white text-xs font-semibold capitalize tracking-wide">
                          {program.type}
                        </span>
                      )}
                      {program.type && <span className="text-muted-foreground/50">•</span>}
                      <span className="truncate">{program.duration || "No duration"}</span>
                      {program.programCode && (
                        <>
                          <span className="text-muted-foreground/50">•</span>
                          <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-md text-xs font-medium text-muted-foreground border dark:border-zinc-700/50">
                            {program.programCode}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                  <div className="flex items-center gap-1">
                    <div className="h-8 w-8 flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all">
                      <ChevronRight className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {!loading && programs.length > 0 && (
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
