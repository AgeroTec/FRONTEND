import { Credor, CredorSearchParams } from '../entities/Credor';
import { PagedResult } from '../types/Common';

export interface ICredorRepository {
  search(params: CredorSearchParams): Promise<PagedResult<Credor>>;
  getById(id: number): Promise<Credor>;
  create(credor: Credor): Promise<Credor>;
  update(id: number, credor: Credor): Promise<Credor>;
  delete(id: number): Promise<void>;
}
