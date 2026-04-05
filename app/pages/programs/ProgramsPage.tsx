import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { dashboardApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { extractErrorMessage, logError } from "@/lib/error-handler";
import { ProgramsView } from "./ProgramsView";

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

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<ProgramResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [localSearch, setLocalSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");
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

      let content: ProgramResponse[] = [];
      let total = 0;
      let pages = 0;

      if (response.data?.content && Array.isArray(response.data.content)) {
        content = response.data.content;
        total = response.data.totalElements || content.length;
        pages = response.data.totalPages || 1;
      } else if (Array.isArray(response.data)) {
        content = response.data;
        total = content.length;
        pages = 1;
      }

      if (filterType !== "ALL") {
        const filtered = content.filter(p => p.type === filterType);
        setPrograms(filtered);
        setTotalElements(filtered.length);
        setTotalPages(Math.ceil(filtered.length / size) || 1);
      } else {
        setPrograms(content);
        setTotalElements(total);
        setTotalPages(pages);
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
  }, [page, size, search, filterType]);

  useEffect(() => {
    setPage(0);
  }, [search, filterType]);

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

  return (
    <ProgramsView
      programs={programs}
      loading={loading}
      totalElements={totalElements}
      error={error}
      localSearch={localSearch}
      setLocalSearch={setLocalSearch}
      filterType={filterType}
      setFilterType={setFilterType}
      page={page}
      size={size}
      handleSizeChange={handleSizeChange}
      fetchPrograms={fetchPrograms}
      handleNextPage={handleNextPage}
      handlePrevPage={handlePrevPage}
      setLocation={setLocation}
    />
  );
}
