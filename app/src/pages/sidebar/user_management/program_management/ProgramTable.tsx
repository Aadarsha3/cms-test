import { useState, useEffect } from "react";
import { dashboardApi } from "@/lib/api";
import { Plus, Search, Loader2, RefreshCw } from "lucide-react";
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

interface ProgramResponse {
  id: string;
  name: string;
  code: string;
  description: string;
}

export function ProgramTable() {
  const [programs, setPrograms] = useState<ProgramResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sort] = useState("id");
  const [direction] = useState("DESC");

  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const fetchPrograms = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { page, size, sort, direction };
      const response = await dashboardApi.get<ProgramResponse[]>("/programs", {
        params,
      });

      if (Array.isArray(response.data)) {
        setPrograms(response.data);
        setTotalElements(response.data.length);
      } else {
        const data = response.data as any;
        if (data && Array.isArray(data.content)) {
          setPrograms(data.content);
          setTotalElements(data.totalElements || data.content.length);
        } else {
          console.warn("Unexpected API response format:", response.data);
          setPrograms([]);
          setTotalElements(0);
          setError("Invalid response format from server");
        }
      }
    } catch (err: any) {
      console.error("Failed to fetch programs:", err);
      setError(err.message || "Failed to load programs");
      toast({
        title: "Error fetching programs",
        description: err.message || "Could not connect to the server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, [page, size, sort, direction]);

  const filteredPrograms = programs.filter((p) => {
    if (!p) return false;
    const searchLower = search.toLowerCase();
    const name = p.name?.toLowerCase() || "";
    const code = p.code?.toLowerCase() || "";
    const description = p.description?.toLowerCase() || "";

    return (
      name.includes(searchLower) ||
      code.includes(searchLower) ||
      description.includes(searchLower)
    );
  });

  const handleNextPage = () => {
    if (programs.length === size) {
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
    <MainLayout title="Program Management">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="program-search-query"
              placeholder="Search by name, code, or description..."
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
              onClick={fetchPrograms}
              className="h-11 w-11 shrink-0"
              title="Refresh List"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
            <Button
              onClick={() => toast({ title: "Feature coming soon", description: "Adding programs will be available soon." })}
              className="gap-2 h-11 px-6 shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Program</span>
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
                  <TableHead>Program Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
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
                ) : filteredPrograms.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {error ? (
                        <span className="text-destructive">
                          Failed to load data.
                        </span>
                      ) : (
                        "No matching programs found."
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPrograms.map((program, index) => (
                    <TableRow
                      key={program.id || index}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => toast({ title: "Program Selected", description: `You selected ${program.name}` })}
                    >
                      <TableCell>{page * size + index + 1}</TableCell>
                      <TableCell className="font-medium">
                        {program.name || "-"}
                      </TableCell>
                      <TableCell>{program.code || "-"}</TableCell>
                      <TableCell className="max-w-[300px] truncate">
                        {program.description || "No description"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {!loading && programs.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {page * size + 1}-{page * size + programs.length} of{" "}
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
                disabled={programs.length < size}
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
