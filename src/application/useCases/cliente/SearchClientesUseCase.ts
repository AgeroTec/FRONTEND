import { IClienteRepository } from "@/domain/repositories/IClienteRepository";
import { ClienteSearchParams, Cliente } from "@/domain/entities/Cliente";
import { PagedResult } from "@/domain/types/Common";

export class SearchClientesUseCase {
  constructor(private readonly clienteRepository: IClienteRepository) {}

  async execute(params: ClienteSearchParams): Promise<PagedResult<Cliente>> {
    try {
      return await this.clienteRepository.search(params);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro ao buscar clientes");
    }
  }
}
