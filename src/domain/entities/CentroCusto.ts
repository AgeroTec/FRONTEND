import { PaginationParams } from '@/domain/types/Common';

export interface CentroCusto {
  codigo?: number;
  nomecentrocusto: string;
  nomeempresa?: string;
  codempresa?: number;
  ativo: string;
  dataCadastro?: string;
  dataAtualizacao?: string;
}

export interface CentroCustoSearchParams extends PaginationParams {
  codigo?: string;
  nomecentrocusto?: string;
  nomeempresa?: string;
  ativo?: string;
}
