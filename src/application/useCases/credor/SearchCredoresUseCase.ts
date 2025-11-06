import { ICredorRepository } from "@/domain/repositories/ICredorRepository";
import { Credor, PagedResult } from "@/domain/entities/Credor";
import {
  credorSearchSchema,
  CredorSearchInput,
} from "@/domain/schemas/credorSchemas";

function sanitizeSearchParams(params: CredorSearchInput): CredorSearchInput {
  return {
    ...params,
    search: params.search?.trim() || undefined,
    doc: params.doc ? params.doc.replace(/\D/g, "") : undefined,
    ativo: params.ativo?.trim() || undefined,
  };
}

export class SearchCredoresUseCase {
  constructor(private readonly credorRepository: ICredorRepository) {}

  async execute(params: CredorSearchInput): Promise<PagedResult<Credor>> {
    try {
      const parsedParams = credorSearchSchema.parse(sanitizeSearchParams(params));
      return await this.credorRepository.search(parsedParams);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro ao buscar credores");
    }
  }
}
