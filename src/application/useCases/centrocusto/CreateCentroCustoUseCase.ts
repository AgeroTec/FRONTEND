import { CentroCusto } from "@/domain/entities/CentroCusto";
import { ICentroCustoRepository } from "@/domain/repositories/ICentroCustoRepository";

export class CreateCentroCustoUseCase {
  constructor(private readonly centroCustoRepository: ICentroCustoRepository) {}

  async execute(centroCusto: CentroCusto): Promise<CentroCusto> {
    if (!centroCusto.nomecentrocusto?.trim()) {
      throw new Error("Nome do centro de custo é obrigatório");
    }

    return await this.centroCustoRepository.create(centroCusto);
  }
}
