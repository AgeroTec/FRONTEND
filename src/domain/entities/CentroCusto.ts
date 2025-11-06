export interface CentroCusto {
  codigo?: number;
  nomecentrocusto: string;
  nomeempresa?: string;
  codempresa?: number;
  ativo: string;
  dataCadastro?: string;
  dataAtualizacao?: string;
}

export interface CentroCustoSearchParams {
  codigo?: string;
  nomecentrocusto?: string;
  nomeempresa?: string;
  ativo?: string;
  page?: number;
  pageSize?: number;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}
