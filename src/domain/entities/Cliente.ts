import { PaginationParams } from '@/domain/types/Common';

export interface Cliente {
  codigo?: number;
  razaoSocial: string;
  nomeFantasia?: string;
  cnpj?: string;
  cpf?: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  municipio?: string;
  uf?: string;
  cep?: string;
  telefone?: string;
  celular?: string;
  email?: string;
  site?: string;
  tipo?: string;
  ativo: string;
  dataCadastro?: string;
  dataAtualizacao?: string;
}

export interface ClienteSearchParams extends PaginationParams {
  codigo?: string;
  razaoSocial?: string;
  nomeFantasia?: string;
  municipio?: string;
  uf?: string;
  cnpjCpf?: string;
  tipo?: string;
  ativo?: string;
}
