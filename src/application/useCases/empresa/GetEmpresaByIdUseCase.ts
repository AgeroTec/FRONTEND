import { IEmpresaRepository } from "@/domain/repositories/IEmpresaRepository";
import { Empresa } from "@/domain/entities/Empresa";

export class GetEmpresaByIdUseCase {
  constructor(private readonly empresaRepository: IEmpresaRepository) {}

  async execute(id: number): Promise<Empresa> {
    try {
      return await this.empresaRepository.getById(id);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro ao buscar empresa");
    }
  }
}
