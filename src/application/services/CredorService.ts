import { credorRepository } from "@/infrastructure/repositories/CredorRepositoryImpl";
import { SearchCredoresUseCase } from "../useCases/credor/SearchCredoresUseCase";
import { CreateCredorUseCase } from "../useCases/credor/CreateCredorUseCase";

export const credorService = {
  search: new SearchCredoresUseCase(credorRepository),
  create: new CreateCredorUseCase(credorRepository),
};
