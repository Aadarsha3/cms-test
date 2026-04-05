import { useState, useEffect, useCallback, useMemo } from "react";
import { dashboardApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { AxiosInstance } from "axios";

interface UseManagementListProps {
  endpoint: string;
  defaultSize?: number;
  idField?: string;
  extraParams?: Record<string, any>;
  apiInstance?: AxiosInstance;
}

export function useManagementList<T>({
  endpoint,
  defaultSize = 10,
  idField = "id",
  extraParams = {},
  apiInstance = dashboardApi,
}: UseManagementListProps) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [localSearch, setLocalSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(defaultSize);
  const { toast } = useToast();

  // Stable reference to extraParams for dep array
  const memoizedExtraParams = useMemo(() => extraParams, [JSON.stringify(extraParams)]);

  // Debounced Search Logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(localSearch);
      setPage(0);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { page, size, search, ...memoizedExtraParams };
      const response = await apiInstance.get<T[]>(endpoint, { params });



      if (Array.isArray(response.data)) {
        setData(response.data);
        setTotalElements(response.data.length);
      } else {
        const payload = response.data as any;
        if (payload && Array.isArray(payload.content)) {
          setData(payload.content);
          setTotalElements(payload.totalElements || payload.content.length);
        } else {
          setData([]);
          setTotalElements(0);
          setError("Unexpected response format");
        }
      }
    } catch (err: any) {
      console.error(`Failed to fetch from ${endpoint}:`, err);
      const message = err.message || "Could not connect to the server";
      setError(message);
      toast({
        title: "Error fetching list",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [endpoint, page, size, search, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleNextPage = () => {
    if (data.length === size) setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 0) setPage((prev) => prev - 1);
  };

  const setPageAndSize = (newPage: number, newSize: number) => {
    setPage(newPage);
    setSize(newSize);
  };

  return {
    data,
    loading,
    totalElements,
    error,
    search: localSearch,
    setSearch: setLocalSearch,
    page,
    size,
    setPage,
    setSize,
    handleNextPage,
    handlePrevPage,
    refresh: fetchData,
  };
}
