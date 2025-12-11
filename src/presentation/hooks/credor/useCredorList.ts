import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { Credor } from "@/domain/entities/Credor";
import { credorService } from "@/application/services/CredorService";

type SortField = 'codigo' | 'nome' | 'cnpj' | 'cpf' | 'ativo' | null;
type SortOrder = 'asc' | 'desc';

interface UseCredorListReturn {
  results: Credor[];
  loading: boolean;
  searchData: { search: string; ativo: string; consistencia?: string };
  pagination: { page: number; pageSize: number; total: number };
  sortField: SortField;
  sortOrder: SortOrder;
  selectedIds: Set<number>;
  allSelected: boolean;
  someSelected: boolean;
  setSearchData: (data: { search: string; ativo: string; consistencia?: string }) => void;
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

export function useCredorList(): UseCredorListReturn {
  const [results, setResults] = useState<Credor[]>([]);
  const [rawResults, setRawResults] = useState<Credor[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState({ search: "", ativo: "S", consistencia: "" });
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20, total: 0 });
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const paginationRef = useRef(pagination);

  // Keep ref in sync with state
  useEffect(() => {
    paginationRef.current = pagination;
  }, [pagination]);

  const handleSearch = useCallback(async (page = 1, customPageSize?: number) => {
    setLoading(true);
    try {
      const pageSize = customPageSize ?? paginationRef.current.pageSize;
      const params = {
        searchTerm: searchData.search || undefined,
        ativo: searchData.ativo || undefined,
        page,
        pageSize,
      };

      const result = await credorService.search.execute(params);

      setRawResults(result.items);
      setPagination({ page, pageSize, total: result.total });
    } catch (error) {
      toast.error("Erro ao buscar credores. Tente novamente.");
      setRawResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchData.search, searchData.ativo, searchData.consistencia]);

  const sortedResults = useMemo(() => {
    if (!sortField) return rawResults;

    const sorted = [...rawResults].sort((a, b) => {
      let aValue: string | number = '';
      let bValue: string | number = '';

      switch (sortField) {
        case 'codigo':
          aValue = a.codigo || 0;
          bValue = b.codigo || 0;
          break;
        case 'nome':
          aValue = a.nome.toLowerCase();
          bValue = b.nome.toLowerCase();
          break;
        case 'cnpj':
          aValue = a.cnpj || '';
          bValue = b.cnpj || '';
          break;
        case 'cpf':
          aValue = a.cpf || '';
          bValue = b.cpf || '';
          break;
        case 'ativo':
          aValue = a.ativo;
          bValue = b.ativo;
          break;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [rawResults, sortField, sortOrder]);

  useEffect(() => {
    setResults(sortedResults);
  }, [sortedResults]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const clearFilters = () => {
    setSearchData({ search: "", ativo: "S", consistencia: "" });
    setSortField(null);
    setSortOrder('asc');
  };

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(1);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchData.search, searchData.ativo, searchData.consistencia]);

  const totalPages = Math.ceil(pagination.total / pagination.pageSize);

  const setPageSize = useCallback((size: number) => {
    setPagination(prev => ({ ...prev, pageSize: size, page: 1 }));
    handleSearch(1, size);
  }, [handleSearch]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      handleSearch(page);
    }
  }, [handleSearch, totalPages]);

  const handleDelete = useCallback(async (credor: Credor) => {
    if (!credor.codigo) {
      toast.error("Credor sem código identificador");
      return;
    }

    try {
      await credorService.delete.execute(credor.codigo);
      toast.success("Credor excluído com sucesso!");
      handleSearch(pagination.page);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao excluir credor";
      toast.error(message);
    }
  }, [handleSearch, pagination.page]);

  const handleToggleStatus = useCallback(async (credor: Credor) => {
    if (!credor.codigo) {
      toast.error("Credor sem código identificador");
      return;
    }

    const newStatus = credor.ativo === "S" ? "N" : "S";
    const action = newStatus === "S" ? "ativado" : "inativado";

    try {
      await credorService.toggleStatus.execute(credor.codigo, newStatus);
      toast.success(`Credor ${action} com sucesso!`);
      handleSearch(pagination.page);
    } catch (error) {
      const message = error instanceof Error ? error.message : `Erro ao ${action === "ativado" ? "ativar" : "inativar"} credor`;
      toast.error(message);
    }
  }, [handleSearch, pagination.page]);

  // Seleção em massa
  const allSelected = useMemo(() => {
    const credoresComCodigo = results.filter(c => c.codigo);
    return credoresComCodigo.length > 0 && credoresComCodigo.every(c => selectedIds.has(c.codigo!));
  }, [results, selectedIds]);

  const someSelected = useMemo(() => {
    return selectedIds.size > 0 && !allSelected;
  }, [selectedIds, allSelected]);

  const toggleSelectAll = useCallback(() => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      const newSelectedIds = new Set<number>();
      results.forEach(c => {
        if (c.codigo) newSelectedIds.add(c.codigo);
      });
      setSelectedIds(newSelectedIds);
    }
  }, [allSelected, results]);

  const toggleSelectOne = useCallback((id: number) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  return {
    results,
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
