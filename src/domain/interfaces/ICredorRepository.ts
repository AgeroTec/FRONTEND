import { Credor, PagedResult } from '../entities/Credor';

export interface CredorSearchParams {
  search?: string;
  doc?: string;
  ativo?: string;
  page: number;
  pageSize: number;
}

export interface ICredorRepository {
  search(params: CredorSearchParams): Promise<PagedResult<Credor>>;
  // testConnection foi removido
}