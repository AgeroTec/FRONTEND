import { ContaCorrente, ContaCorrenteSearchParams } from "../entities/ContaCorrente";
import { PagedResult } from "../types/Common";

export interface IContaCorrenteRepository {
  search(params: ContaCorrenteSearchParams): Promise<PagedResult<ContaCorrente>>;
  getById(id: number): Promise<ContaCorrente>;
  create(contaCorrente: ContaCorrente): Promise<ContaCorrente>;
  update(id: number, contaCorrente: ContaCorrente): Promise<ContaCorrente>;
  delete(id: number): Promise<void>;
}
