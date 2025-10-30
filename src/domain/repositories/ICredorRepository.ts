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
  findById(id: number): Promise<Credor>;
  create(credor: Omit<Credor, 'id'>): Promise<Credor>;
  update(id: number, credor: Partial<Credor>): Promise<Credor>;
  delete(id: number): Promise<void>;
}