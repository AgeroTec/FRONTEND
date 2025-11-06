import { IEmpresaRepository } from "@/domain/repositories/IEmpresaRepository";
import { Empresa } from "@/domain/entities/Empresa";

export class CreateEmpresaUseCase {
  constructor(private readonly empresaRepository: IEmpresaRepository) {}

  async execute(empresa: Empresa): Promise<Empresa> {
    try {
      // Validações básicas
      if (!empresa.nomeempresa?.trim()) {
        throw new Error("Nome da empresa é obrigatório");
      }

      return await this.empresaRepository.create(empresa);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro ao criar empresa");
    }
  }
}
