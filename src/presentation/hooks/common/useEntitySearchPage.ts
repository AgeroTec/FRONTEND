import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

type FiltersBase = Record<string, string>;

export interface EntityPaginationState {
  page: number;
  pageSize: number;
  total: number;
}

interface UseEntitySearchPageOptions<TItem, TFilters extends FiltersBase> {
  defaultFilters: TFilters;
  search: (params: TFilters & { page: number; pageSize: number }) => Promise<{ items: TItem[]; total: number }>;
  debounceMs?: number;
  defaultPageSize?: number;
  genericErrorMessage?: string;
}

function buildFiltersFromQuery<TFilters extends FiltersBase>(searchParams: URLSearchParams, defaultFilters: TFilters): TFilters {
  const nextFilters = { ...defaultFilters };
  (Object.keys(defaultFilters) as (keyof TFilters)[]).forEach((key) => {
    nextFilters[key] = (searchParams.get(String(key)) ?? "") as TFilters[keyof TFilters];
  });
  return nextFilters;
}

function areFiltersEqual<TFilters extends FiltersBase>(a: TFilters, b: TFilters): boolean {
  const aKeys = Object.keys(a) as (keyof TFilters)[];
  for (const key of aKeys) {
    if (a[key] !== b[key]) return false;
  }
  return true;
}

function readPagination(searchParams: URLSearchParams, defaultPageSize: number): EntityPaginationState {
  const rawPage = Number(searchParams.get("page") ?? "1");
  const rawPageSize = Number(searchParams.get("pageSize") ?? String(defaultPageSize));
  return {
    page: Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1,
    pageSize: Number.isFinite(rawPageSize) && rawPageSize > 0 ? rawPageSize : defaultPageSize,
    total: 0,
  };
}

export function useEntitySearchPage<TItem, TFilters extends FiltersBase>({
  defaultFilters,
  search,
  debounceMs = 400,
  defaultPageSize = 20,
  genericErrorMessage = "Nao foi possivel conectar ao servidor.",
}: UseEntitySearchPageOptions<TItem, TFilters>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [results, setResults] = useState<TItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [filters, setFilters] = useState<TFilters>(() =>
    buildFiltersFromQuery(new URLSearchParams(searchParams.toString()), defaultFilters)
  );
  const [pagination, setPagination] = useState<EntityPaginationState>(() =>
    readPagination(new URLSearchParams(searchParams.toString()), defaultPageSize)
  );

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const requestSequenceRef = useRef(0);
  const filtersRef = useRef(filters);
  const paginationRef = useRef(pagination);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    paginationRef.current = pagination;
  }, [pagination]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const nextFilters = buildFiltersFromQuery(params, defaultFilters);
    const nextPagination = readPagination(params, defaultPageSize);

    setFilters((prev) => (areFiltersEqual(prev, nextFilters) ? prev : nextFilters));
    setPagination((prev) => {
      if (prev.page === nextPagination.page && prev.pageSize === nextPagination.pageSize) {
        return prev;
      }
      return { ...prev, page: nextPagination.page, pageSize: nextPagination.pageSize };
    });
  }, [defaultFilters, defaultPageSize, searchParams]);

  const syncUrl = useCallback(
    (nextFilters: TFilters, page: number, pageSize: number) => {
      const params = new URLSearchParams();
      (Object.keys(nextFilters) as (keyof TFilters)[]).forEach((key) => {
        const value = String(nextFilters[key] ?? "").trim();
        if (value) params.set(String(key), value);
      });

      if (page > 1) params.set("page", String(page));
      if (pageSize !== defaultPageSize) params.set("pageSize", String(pageSize));

      const query = params.toString();
      const currentQuery = searchParams.toString();
      if (query === currentQuery) return;
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [defaultPageSize, pathname, router, searchParams]
  );

  const handleSearch = useCallback(
    async (nextFilters?: TFilters, page?: number, pageSize?: number) => {
      const activeFilters = nextFilters ?? filtersRef.current;
      const activePage = page ?? paginationRef.current.page;
      const activePageSize = pageSize ?? paginationRef.current.pageSize;
      const seq = ++requestSequenceRef.current;
      setLoading(true);
      syncUrl(activeFilters, activePage, activePageSize);

      try {
        const response = await search({ ...activeFilters, page: activePage, pageSize: activePageSize });
        if (seq !== requestSequenceRef.current) return;

        setResults(response.items || []);
        setPagination({ page: activePage, pageSize: activePageSize, total: response.total || 0 });
        setHasSearched(true);
      } catch (error) {
        if (seq !== requestSequenceRef.current) return;
        toast.error(error instanceof Error ? error.message : genericErrorMessage);
        setResults([]);
        setHasSearched(true);
      } finally {
        if (seq === requestSequenceRef.current) setLoading(false);
      }
    },
    [genericErrorMessage, search, syncUrl]
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void handleSearch(filters, 1, pagination.pageSize);
    }, debounceMs);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [debounceMs, filters, handleSearch, pagination.pageSize]);

  const updateFilter = useCallback((field: keyof TFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, [defaultFilters]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !loading) {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        void handleSearch(filters, 1, pagination.pageSize);
      }
    },
    [filters, handleSearch, loading, pagination.pageSize]
  );

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((pagination.total || 0) / pagination.pageSize)),
    [pagination.pageSize, pagination.total]
  );

  return {
    results,
    loading,
    hasSearched,
    filters,
    pagination,
    totalPages,
    setFilters,
    updateFilter,
    clearFilters,
    handleSearch,
    handleKeyDown,
  };
}
