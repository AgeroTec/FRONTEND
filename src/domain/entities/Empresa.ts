export interface Empresa {
  codigo?: number;
  nomeempresa: string;
  nomefantasia?: string;
  codgrupoempresa?: string;
  nucnpj?: string;
  nuinscricaoestadual?: string;
  nuinscricaomunicipal?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
  telefone?: string;
  email?: string;
  site?: string;
  ativo: string;
  dataCadastro?: string;
  dataAtualizacao?: string;
}

export interface EmpresaSearchParams {
  codigo?: string;
  nomeempresa?: string;
  codgrupoempresa?: string;
  nucnpj?: string;
  uf?: string;
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
