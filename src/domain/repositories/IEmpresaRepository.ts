import { Empresa, EmpresaSearchParams } from "../entities/Empresa";
import { PagedResult } from "../types/Common";

export interface IEmpresaRepository {
  search(params: EmpresaSearchParams): Promise<PagedResult<Empresa>>;
  getById(id: number): Promise<Empresa>;
  create(empresa: Empresa): Promise<Empresa>;
  update(id: number, empresa: Empresa): Promise<Empresa>;
  delete(id: number): Promise<void>;
}
