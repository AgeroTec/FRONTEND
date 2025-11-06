import { IEmpresaRepository } from "@/domain/repositories/IEmpresaRepository";
import { Empresa } from "@/domain/entities/Empresa";

export class UpdateEmpresaUseCase {
  constructor(private readonly empresaRepository: IEmpresaRepository) {}

  async execute(id: number, empresa: Empresa): Promise<Empresa> {
    try {
      // Validações básicas
      if (!empresa.nomeempresa?.trim()) {
        throw new Error("Nome da empresa é obrigatório");
      }

      return await this.empresaRepository.update(id, empresa);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro ao atualizar empresa");
    }
  }
}
