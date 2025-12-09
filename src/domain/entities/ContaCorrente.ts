import { PaginationParams } from '@/domain/types/Common';

export interface ContaCorrente {
  codigo?: number;
  nomeconta: string;
  cdempresa?: number;
  nomeempresa?: string;
  banco?: string;
  codigoBanco?: string;
  agencia?: string;
  conta?: string;
  digito?: string;
  tipoConta?: string;
  titular?: string;
  cnpjTitular?: string;
  tipoPessoa?: string;
  saldoInicial?: number;
  dataAbertura?: string;
  ativo: string;
  dataCadastro?: string;
  dataAtualizacao?: string;
}

export interface ContaCorrenteSearchParams extends PaginationParams {
  codigo?: string;
  nomeconta?: string;
  cdempresa?: string;
  banco?: string;
  codigoBanco?: string;
  agencia?: string;
  conta?: string;
  titular?: string;
  cnpjTitular?: string;
  ativo?: string;
}
