import { useState, useCallback } from 'react';
import { Credor, PagedResult } from '@/domain/entities/Credor';
import { CredorRepository } from '@/infrastructure/repositories/CredorRepository';
import { CredorSearchParams } from '@/domain/interfaces/ICredorRepository';

interface UseCredoresReturn {
  results: Credor[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
  };
  search: (params: Omit<CredorSearchParams, 'page' | 'pageSize'>) => Promise<void>;
  changePage: (page: number) => Promise<void>;
  changePageSize: (pageSize: number) => Promise<void>;
  clearResults: () => void;
}

export const useCredores = (): UseCredoresReturn => {
  const [pagedResult, setPagedResult] = useState<PagedResult<Credor>>({
    items: [],
    page: 1,
    pageSize: 20,
    total: 0
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const credorRepository = new CredorRepository();

  // ✅ Calcular valores derivados da paginação
  const totalPages = Math.ceil(pagedResult.total / pagedResult.pageSize);
  const hasPrevious = pagedResult.page > 1;
  const hasNext = pagedResult.page < totalPages;

  const executeSearch = useCallback(async (params: CredorSearchParams) => {
    setLoading(true);
    setError(null);

    try {
      const data = await credorRepository.search(params);
      setPagedResult(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);
      setPagedResult(prev => ({ ...prev, items: [] }));
    } finally {
      setLoading(false);
    }
  }, []);

  const search = useCallback(async (searchParams: Omit<CredorSearchParams, 'page' | 'pageSize'>) => {
    await executeSearch({
      ...searchParams,
      page: 1, // ✅ Sempre começa na página 1 em nova busca
      pageSize: pagedResult.pageSize
    });
  }, [executeSearch, pagedResult.pageSize]);

  const changePage = useCallback(async (page: number) => {
    if (page < 1 || page > totalPages) return;
    
    await executeSearch({
      page,
      pageSize: pagedResult.pageSize
      // Mantém os filtros atuais se existirem
    });
  }, [executeSearch, pagedResult.pageSize, totalPages]);

  const changePageSize = useCallback(async (pageSize: number) => {
    await executeSearch({
      page: 1, // ✅ Volta para página 1 ao mudar o tamanho
      pageSize
    });
  }, [executeSearch]);

  const clearResults = useCallback(() => {
    setPagedResult({
      items: [],
      page: 1,
      pageSize: 20,
      total: 0
    });
    setError(null);
  }, []);

  return {
    results: pagedResult.items,
    loading,
    error,
    pagination: {
      currentPage: pagedResult.page,
      pageSize: pagedResult.pageSize,
      totalItems: pagedResult.total,
      totalPages,
      hasPrevious,
      hasNext
    },
    search,
    changePage,
    changePageSize,
    clearResults
  };
};