
import { Plus, Search, Loader2, RefreshCw, BookOpen, ChevronRight } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RowsSelector } from "@/components/common/RowsSelector";
import { TablePagination } from "@/components/common/TablePagination";
import { PROGRAM_TYPES } from "@/lib/constants";

interface ProgramResponse {
  id: string;
  name: string;
  programCode: string;
  duration: string;
  type?: string;
}

interface ProgramsViewProps {
  programs: ProgramResponse[];
  loading: boolean;
  totalElements: number;
  error: string | null;
  localSearch: string;
  setLocalSearch: (s: string) => void;
  filterType: string;
  setFilterType: (v: string) => void;
  page: number;
  size: number;
  handleSizeChange: (s: number) => void;
  fetchPrograms: () => void;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  setLocation: (loc: string) => void;
}

export function ProgramsView({
  programs,
  loading,
  totalElements,
  error,
  localSearch,
  setLocalSearch,
  filterType,
  setFilterType,
  page,
  size,
  handleSizeChange,
  fetchPrograms,
  handleNextPage,
  handlePrevPage,
  setLocation,
}: ProgramsViewProps) {
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

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden lg:inline">Type:</span>
              <Select value={filterType} onValueChange={(v) => setFilterType(v)}>
                <SelectTrigger className="h-11 w-[130px] bg-white dark:bg-zinc-950 border-[#243F76]/10 dark:border-white/10 shadow-sm">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  {PROGRAM_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <RowsSelector value={size} onValueChange={handleSizeChange} />

            <Button
              variant="outline"
              size="icon"
              onClick={fetchPrograms}
              className="h-11 w-11 shrink-0"
              title="Refresh List"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
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
              {localSearch ? "No matching programs found." : "No programs created yet."}
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

        <TablePagination
          page={page}
          size={size}
          itemsLength={programs.length}
          totalElements={totalElements}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
          loading={loading}
        />
      </div>
    </MainLayout>
  );
}
