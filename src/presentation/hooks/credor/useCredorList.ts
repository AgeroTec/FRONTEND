import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { Credor } from "@/domain/entities/Credor";
import { credorService } from "@/application/services/CredorService";

type SortField = 'nome' | 'cnpj' | 'cpf' | 'ativo' | null;
type SortOrder = 'asc' | 'desc';

interface UseCredorListReturn {
  results: Credor[];
  loading: boolean;
  searchData: { search: string; ativo: string };
  pagination: { page: number; pageSize: number; total: number };
  sortField: SortField;
  sortOrder: SortOrder;
  setSearchData: (data: { search: string; ativo: string }) => void;
  handleSearch: (page?: number) => Promise<void>;
  clearFilters: () => void;
  handleSort: (field: SortField) => void;
  totalPages: number;
  setPageSize: (size: number) => void;
  goToPage: (page: number) => void;
}

export function useCredorList(): UseCredorListReturn {
  const [results, setResults] = useState<Credor[]>([]);
  const [rawResults, setRawResults] = useState<Credor[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState({ search: "", ativo: "S" });
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20, total: 0 });
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
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
  }, [searchData.search, searchData.ativo]);

  const sortedResults = useMemo(() => {
    if (!sortField) return rawResults;

    const sorted = [...rawResults].sort((a, b) => {
      let aValue: string | number = '';
      let bValue: string | number = '';

      switch (sortField) {
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
    setSearchData({ search: "", ativo: "S" });
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
  }, [searchData.search, searchData.ativo, handleSearch]);

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

  return {
    results,
    loading,
    searchData,
    pagination,
    sortField,
    sortOrder,
    setSearchData,
    handleSearch,
    clearFilters,
    handleSort,
    totalPages,
    setPageSize,
    goToPage,
  };
}
