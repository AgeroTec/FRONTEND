import { CentroCusto, CentroCustoSearchParams } from "@/domain/entities/CentroCusto";
import { ICentroCustoRepository } from "@/domain/repositories/ICentroCustoRepository";
import { PagedResult } from "@/domain/types/Common";

export class SearchCentroCustosUseCase {
  constructor(private readonly centroCustoRepository: ICentroCustoRepository) {}

  async execute(params: CentroCustoSearchParams): Promise<PagedResult<CentroCusto>> {
    return await this.centroCustoRepository.search(params);
  }
}
