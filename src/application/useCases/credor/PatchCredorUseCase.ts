import { Credor } from "@/domain/entities/Credor";
import { ICredorRepository } from "@/domain/repositories/ICredorRepository";

export class PatchCredorUseCase {
  constructor(private readonly credorRepository: ICredorRepository) {}

  async execute(id: number, data: Partial<Credor>): Promise<Credor> {
    try {
      if (!id || id <= 0 || !Number.isInteger(id)) {
        throw new Error("ID inválido");
      }

      if (data.nome !== undefined && data.nome.trim().length === 0) {
        throw new Error("Nome não pode ser vazio");
      }

      if (data.cnpj && data.cpf) {
        throw new Error("Informe apenas CNPJ ou CPF, não ambos");
      }

      return await this.credorRepository.patch(id, data);
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Erro ao atualizar credor");
    }
  }
}
