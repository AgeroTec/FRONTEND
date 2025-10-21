export interface Credor {
  id: number;
  nome: string;
  fantasia: string | null;
  cnpj: string | null;
  cpf: string | null;
  ativo: string;
}

// CORRIGIDO: Baseado na resposta real da sua API
export interface PagedResult<T> {
  items: T[];
  page: number;           // minúsculo (não PageNumber)
  pageSize: number;       // minúsculo (não PageSize)  
  total: number;          // total (não totalCount)
  // totalPages, hasPrevious, hasNext podem ser calculados
}

// Interface para parâmetros de paginação
export interface PaginationParams {
  page: number;
  pageSize: number;
}