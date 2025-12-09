import { Cliente, ClienteSearchParams } from "../entities/Cliente";
import { PagedResult } from "../types/Common";

export interface IClienteRepository {
  search(params: ClienteSearchParams): Promise<PagedResult<Cliente>>;
  getById(id: number): Promise<Cliente>;
  create(cliente: Cliente): Promise<Cliente>;
  update(id: number, cliente: Cliente): Promise<Cliente>;
  delete(id: number): Promise<void>;
}
