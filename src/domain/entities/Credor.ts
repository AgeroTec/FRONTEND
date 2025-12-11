import { PaginationParams } from "../types/Common";

export interface Credor {
  codigo?: number;
  nome: string;
  fantasia?: string;
  cnpj?: string;
  cpf?: string;
  ativo: string;
  tipoPessoa?: 'fisica' | 'juridica';
  tipoCredor?: 'corretor' | 'fornecedor' | 'prestador' | 'cliente' | 'parceiro';
  microempresa?: boolean;
  transportadora?: boolean;
  estrangeiro?: boolean;
  dataCadastro?: string;
  dataAtualizacao?: string;
}

export interface CredorSearchParams extends PaginationParams {
  searchTerm?: string;
  doc?: string;
  ativo?: string;
}