import { IClienteRepository } from "@/domain/repositories/IClienteRepository";
import { Cliente } from "@/domain/entities/Cliente";

export class CreateClienteUseCase {
  constructor(private readonly clienteRepository: IClienteRepository) {}

  async execute(cliente: Cliente): Promise<Cliente> {
    try {
      if (!cliente.razaoSocial?.trim()) {
        throw new Error("Razão Social / Nome é obrigatório");
      }

      return await this.clienteRepository.create(cliente);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro ao criar cliente");
    }
  }
}
