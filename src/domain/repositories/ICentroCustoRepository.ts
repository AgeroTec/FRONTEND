import { CentroCusto, CentroCustoSearchParams, PagedResult } from "../entities/CentroCusto";

export interface ICentroCustoRepository {
  search(params: CentroCustoSearchParams): Promise<PagedResult<CentroCusto>>;
  getById(id: number): Promise<CentroCusto>;
  create(centroCusto: CentroCusto): Promise<CentroCusto>;
  update(id: number, centroCusto: CentroCusto): Promise<CentroCusto>;
  delete(id: number): Promise<void>;
}
