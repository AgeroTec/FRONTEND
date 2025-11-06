import { Empresa, EmpresaSearchParams, PagedResult } from "../entities/Empresa";

export interface IEmpresaRepository {
  search(params: EmpresaSearchParams): Promise<PagedResult<Empresa>>;
  getById(id: number): Promise<Empresa>;
  create(empresa: Empresa): Promise<Empresa>;
  update(id: number, empresa: Empresa): Promise<Empresa>;
  delete(id: number): Promise<void>;
}
