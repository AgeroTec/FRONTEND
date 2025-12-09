import { Credor, CredorSearchParams } from "@/domain/entities/Credor";
import { ICredorRepository } from "@/domain/repositories/ICredorRepository";
import { PagedResult } from "@/domain/types/Common";

export class SearchCredoresUseCase {
  constructor(private readonly credorRepository: ICredorRepository) {}

  async execute(params: CredorSearchParams): Promise<PagedResult<Credor>> {
    try {
      return await this.credorRepository.search(params);
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Erro ao buscar credores");
    }
  }
}
