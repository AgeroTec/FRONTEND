import { Credor } from "@/domain/entities/Credor";
import { ICredorRepository } from "@/domain/repositories/ICredorRepository";

export class UpdateCredorUseCase {
  constructor(private readonly credorRepository: ICredorRepository) {}

  async execute(id: number, credor: Credor): Promise<Credor> {
    try {
      if (!id || id <= 0 || !Number.isInteger(id)) {
        throw new Error("ID inválido");
      }

      if (credor.nome && credor.nome.trim().length === 0) {
        throw new Error("Nome não pode ser vazio");
      }

      if (credor.cnpj && credor.cpf) {
        throw new Error("Informe apenas CNPJ ou CPF, não ambos");
      }

      return await this.credorRepository.update(id, credor);
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Erro ao atualizar credor");
    }
  }
}
