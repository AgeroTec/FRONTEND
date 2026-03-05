import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Credor } from "@/domain/entities/Credor";
import { credorService } from "@/infrastructure/di/services";

type SortField = "codigo" | "nome" | "cnpj" | "cpf" | "ativo" | null;
type SortOrder = "asc" | "desc";

type CredorFilters = { search: string; ativo: string; consistencia?: string };
type PaginationState = { page: number; pageSize: number; total: number };

interface UseCredorListReturn {
  results: Credor[];
  loading: boolean;
  searchData: CredorFilters;
  pagination: PaginationState;
  sortField: SortField;
  sortOrder: SortOrder;
  selectedIds: Set<number>;
  allSelected: boolean;
  someSelected: boolean;
  setSearchData: (data: CredorFilters) => void;
  handleSearch: (page?: number) => Promise<void>;
  clearFilters: () => void;
  handleSort: (field: SortField) => void;
  totalPages: number;
  setPageSize: (size: number) => void;
  goToPage: (page: number) => void;
  handleDelete: (credor: Credor) => Promise<void>;
  handleToggleStatus: (credor: Credor) => Promise<void>;
  toggleSelectAll: () => void;
  toggleSelectOne: (id: number) => void;
  clearSelection: () => void;
}

function getInitialFilters(): CredorFilters {
  if (typeof window === "undefined") {
    return { search: "", ativo: "S", consistencia: "" };
  }

  const params = new URLSearchParams(window.location.search);
  return {
    search: params.get("q") ?? "",
    ativo: params.get("ativo") ?? "S",
    consistencia: params.get("consistencia") ?? "",
  };
}

function getInitialPagination(): PaginationState {
  if (typeof window === "undefined") {
    return { page: 1, pageSize: 20, total: 0 };
  }

  const params = new URLSearchParams(window.location.search);
  const page = Number(params.get("page") ?? "1");
  const pageSize = Number(params.get("pageSize") ?? "20");

  return {
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize: Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 20,
    total: 0,
  };
}

export function useCredorList(): UseCredorListReturn {
  const router = useRouter();
  const pathname = usePathname();

  const [rawResults, setRawResults] = useState<Credor[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchDataState] = useState<CredorFilters>(() => getInitialFilters());
  const [pagination, setPagination] = useState<PaginationState>(() => getInitialPagination());
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const paginationRef = useRef(pagination);
  const requestSequenceRef = useRef(0);
  const searchCacheRef = useRef<Map<string, { items: Credor[]; total: number }>>(new Map());

  const syncUrl = useCallback(
    (filters: CredorFilters, page: number, pageSize: number) => {
      const params = new URLSearchParams();

      if (filters.search.trim()) params.set("q", filters.search.trim());
      if (filters.ativo && filters.ativo !== "S") params.set("ativo", filters.ativo);
      if (filters.consistencia?.trim()) params.set("consistencia", filters.consistencia.trim());
      if (page > 1) params.set("page", String(page));
      if (pageSize !== 20) params.set("pageSize", String(pageSize));

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router]
  );

  useEffect(() => {
    paginationRef.current = pagination;
  }, [pagination]);

  const handleSearch = useCallback(
    async (page = 1, customPageSize?: number) => {
      const pageSize = customPageSize ?? paginationRef.current.pageSize;
      const seq = ++requestSequenceRef.current;
      const cacheKey = JSON.stringify({
        q: searchData.search || "",
        ativo: searchData.ativo || "",
        page,
        pageSize,
      });

      const cached = searchCacheRef.current.get(cacheKey);
      if (cached) {
        setRawResults(cached.items);
        setPagination({ page, pageSize, total: cached.total });
        setLoading(false);
        syncUrl(searchData, page, pageSize);
        return;
      }

      setLoading(true);
      syncUrl(searchData, page, pageSize);

      try {
        const result = await credorService.search.execute({
          searchTerm: searchData.search || undefined,
          ativo: searchData.ativo || undefined,
          page,
          pageSize,
        });

        if (seq !== requestSequenceRef.current) return;

        searchCacheRef.current.set(cacheKey, {
          items: result.items,
          total: result.total,
        });
        setRawResults(result.items);
        setPagination({ page, pageSize, total: result.total });
      } catch {
        if (seq !== requestSequenceRef.current) return;
        toast.error("Erro ao buscar credores. Tente novamente.");
        setRawResults([]);
      } finally {
        if (seq === requestSequenceRef.current) {
          setLoading(false);
        }
      }
    },
    [searchData, syncUrl]
  );

  const sortedResults = useMemo(() => {
    if (!sortField) return rawResults;

    return [...rawResults].sort((a, b) => {
      let aValue: string | number = "";
      let bValue: string | number = "";

      switch (sortField) {
        case "codigo":
          aValue = a.codigo || 0;
          bValue = b.codigo || 0;
          break;
        case "nome":
          aValue = a.nome.toLowerCase();
          bValue = b.nome.toLowerCase();
          break;
        case "cnpj":
          aValue = a.cnpj || "";
          bValue = b.cnpj || "";
          break;
        case "cpf":
          aValue = a.cpf || "";
          bValue = b.cpf || "";
          break;
        case "ativo":
          aValue = a.ativo;
          bValue = b.ativo;
          break;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [rawResults, sortField, sortOrder]);

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        return;
      }

      setSortField(field);
      setSortOrder("asc");
    },
    [sortField]
  );

  const setSearchData = useCallback((data: CredorFilters) => {
    setSearchDataState(data);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchDataState({ search: "", ativo: "S", consistencia: "" });
    setSortField(null);
    setSortOrder("asc");
    setSelectedIds(new Set());
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      void handleSearch(1);
    }, 400);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [handleSearch]);

  const totalPages = Math.max(1, Math.ceil(pagination.total / pagination.pageSize));

  const setPageSize = useCallback(
    (size: number) => {
      setPagination((prev) => ({ ...prev, pageSize: size, page: 1 }));
      void handleSearch(1, size);
    },
    [handleSearch]
  );

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        void handleSearch(page);
      }
    },
    [handleSearch, totalPages]
  );

  const handleDelete = useCallback(
    async (credor: Credor) => {
      if (!credor.codigo) {
        toast.error("Credor sem codigo identificador");
        return;
      }

      const removedId = credor.codigo;
      const previousResults = rawResults;
      const previousPagination = pagination;
      const previousSelectedIds = new Set(selectedIds);

      setRawResults((prev) => prev.filter((item) => item.codigo !== removedId));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(removedId);
        return next;
      });
      setPagination((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));

      try {
        await credorService.delete.execute(removedId);
        searchCacheRef.current.clear();
        toast.success("Credor excluido com sucesso!");

        const currentPageItemCount = previousResults.filter((item) => item.codigo !== removedId).length;
        if (currentPageItemCount === 0 && previousPagination.page > 1) {
          void handleSearch(previousPagination.page - 1);
        }
      } catch (error) {
        setRawResults(previousResults);
        setPagination(previousPagination);
        setSelectedIds(previousSelectedIds);

        const message = error instanceof Error ? error.message : "Erro ao excluir credor";
        toast.error(message);
      }
    },
    [handleSearch, pagination, rawResults, selectedIds]
  );

  const handleToggleStatus = useCallback(
    async (credor: Credor) => {
      if (!credor.codigo) {
        toast.error("Credor sem codigo identificador");
        return;
      }

      const credorId = credor.codigo;
      const newStatus = credor.ativo === "S" ? "N" : "S";
      const action = newStatus === "S" ? "ativado" : "inativado";

      setRawResults((prev) =>
        prev.map((item) => (item.codigo === credorId ? { ...item, ativo: newStatus } : item))
      );

      try {
        const updatedCredor = await credorService.toggleStatus.execute(credorId, newStatus);
        searchCacheRef.current.clear();

        setRawResults((prev) =>
          prev.map((item) => (item.codigo === credorId ? { ...item, ...updatedCredor } : item))
        );

        toast.success(`Credor ${action} com sucesso!`);
      } catch (error) {
        setRawResults((prev) =>
          prev.map((item) => (item.codigo === credorId ? { ...item, ativo: credor.ativo } : item))
        );

        const message =
          error instanceof Error
            ? error.message
            : `Erro ao ${action === "ativado" ? "ativar" : "inativar"} credor`;
        toast.error(message);
      }
    },
    []
  );

  const allSelected = useMemo(() => {
    const credoresComCodigo = sortedResults.filter((credor) => credor.codigo);
    return (
      credoresComCodigo.length > 0 &&
      credoresComCodigo.every((credor) => selectedIds.has(credor.codigo!))
    );
  }, [selectedIds, sortedResults]);

  const someSelected = useMemo(() => {
    return selectedIds.size > 0 && !allSelected;
  }, [selectedIds, allSelected]);

  const toggleSelectAll = useCallback(() => {
    if (allSelected) {
      setSelectedIds(new Set());
      return;
    }

    const newSelectedIds = new Set<number>();
    sortedResults.forEach((credor) => {
      if (credor.codigo) {
        newSelectedIds.add(credor.codigo);
      }
    });
    setSelectedIds(newSelectedIds);
  }, [allSelected, sortedResults]);

  const toggleSelectOne = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  return {
    results: sortedResults,
    loading,
    searchData,
    pagination,
    sortField,
    sortOrder,
    selectedIds,
    allSelected,
    someSelected,
    setSearchData,
    handleSearch,
    clearFilters,
    handleSort,
    totalPages,
    setPageSize,
    goToPage,
    handleDelete,
    handleToggleStatus,
    toggleSelectAll,
    toggleSelectOne,
    clearSelection,
  };
}
