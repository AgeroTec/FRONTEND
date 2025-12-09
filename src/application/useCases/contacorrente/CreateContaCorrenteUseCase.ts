import { ContaCorrente } from "@/domain/entities/ContaCorrente";
import { IContaCorrenteRepository } from "@/domain/repositories/IContaCorrenteRepository";

export class CreateContaCorrenteUseCase {
  constructor(private contaCorrenteRepository: IContaCorrenteRepository) {}

  async execute(contaCorrente: ContaCorrente): Promise<ContaCorrente> {
    return await this.contaCorrenteRepository.create(contaCorrente);
  }
}
