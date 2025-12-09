import { ContaCorrente, ContaCorrenteSearchParams } from "@/domain/entities/ContaCorrente";
import { IContaCorrenteRepository } from "@/domain/repositories/IContaCorrenteRepository";
import { PagedResult } from "@/domain/types/Common";

export class SearchContasCorrentesUseCase {
  constructor(private contaCorrenteRepository: IContaCorrenteRepository) {}

  async execute(params: ContaCorrenteSearchParams): Promise<PagedResult<ContaCorrente>> {
    return await this.contaCorrenteRepository.search(params);
  }
}
