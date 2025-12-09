import { IEmpresaRepository } from "@/domain/repositories/IEmpresaRepository";
import { EmpresaSearchParams, Empresa } from "@/domain/entities/Empresa";
import { PagedResult } from "@/domain/types/Common";

export class SearchEmpresasUseCase {
  constructor(private readonly empresaRepository: IEmpresaRepository) {}

  async execute(params: EmpresaSearchParams): Promise<PagedResult<Empresa>> {
    try {
      return await this.empresaRepository.search(params);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro ao buscar empresas");
    }
  }
}
