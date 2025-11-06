import { Cliente, ClienteSearchParams, PagedResult } from "../entities/Cliente";

export interface IClienteRepository {
  search(params: ClienteSearchParams): Promise<PagedResult<Cliente>>;
  getById(id: number): Promise<Cliente>;
  create(cliente: Cliente): Promise<Cliente>;
  update(id: number, cliente: Cliente): Promise<Cliente>;
  delete(id: number): Promise<void>;
}
