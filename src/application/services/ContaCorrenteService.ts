import { ContaCorrenteRepositoryImpl } from "@/infrastructure/repositories/ContaCorrenteRepositoryImpl";
import { SearchContasCorrentesUseCase } from "../useCases/contacorrente/SearchContasCorrentesUseCase";
import { CreateContaCorrenteUseCase } from "../useCases/contacorrente/CreateContaCorrenteUseCase";

const contaCorrenteRepository = new ContaCorrenteRepositoryImpl();

export const contaCorrenteService = {
  searchContasCorrentes: new SearchContasCorrentesUseCase(contaCorrenteRepository),
  createContaCorrente: new CreateContaCorrenteUseCase(contaCorrenteRepository),
};
