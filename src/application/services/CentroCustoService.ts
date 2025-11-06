import { centroCustoRepository } from "@/infrastructure/repositories/CentroCustoRepositoryImpl";
import { CentroCustoSearchParams, PagedResult, CentroCusto } from "@/domain/entities/CentroCusto";

class SearchCentroCustosUseCase {
  async execute(params: CentroCustoSearchParams): Promise<PagedResult<CentroCusto>> {
    return await centroCustoRepository.search(params);
  }
}

class CreateCentroCustoUseCase {
  async execute(centroCusto: CentroCusto): Promise<CentroCusto> {
    if (!centroCusto.nomecentrocusto?.trim()) {
      throw new Error("Nome do centro de custo é obrigatório");
    }
    return await centroCustoRepository.create(centroCusto);
  }
}

export const centroCustoService = {
  search: new SearchCentroCustosUseCase(),
  create: new CreateCentroCustoUseCase(),
};
