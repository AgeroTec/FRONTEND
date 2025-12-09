import { Credor } from "@/domain/entities/Credor";
import { ICredorRepository } from "@/domain/repositories/ICredorRepository";

export class CreateCredorUseCase {
  constructor(private readonly credorRepository: ICredorRepository) {}

  async execute(credor: Credor): Promise<Credor> {
    try {
      if (!credor.nome || credor.nome.trim().length === 0) {
        throw new Error("Nome é obrigatório");
      }

      if (!credor.cnpj && !credor.cpf) {
        throw new Error("CNPJ ou CPF é obrigatório");
      }

      if (credor.cnpj && credor.cpf) {
        throw new Error("Informe apenas CNPJ ou CPF, não ambos");
      }

      return await this.credorRepository.create(credor);
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Erro ao criar credor");
    }
  }
}
