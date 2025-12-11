import { Credor } from "@/domain/entities/Credor";
import { ICredorRepository } from "@/domain/repositories/ICredorRepository";

export class ToggleCredorStatusUseCase {
  constructor(private readonly credorRepository: ICredorRepository) {}

  async execute(id: number, newStatus: "S" | "N"): Promise<Credor> {
    try {
      if (!id || id <= 0) {
        throw new Error("ID inválido");
      }

      if (newStatus !== "S" && newStatus !== "N") {
        throw new Error("Status inválido");
      }

      return await this.credorRepository.patch(id, { ativo: newStatus });
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Erro ao atualizar status do credor");
    }
  }
}
