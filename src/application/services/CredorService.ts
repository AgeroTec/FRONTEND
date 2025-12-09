import { credorRepository } from "@/infrastructure/repositories/CredorRepositoryImpl";
import { SearchCredoresUseCase } from "../useCases/credor/SearchCredoresUseCase";
import { CreateCredorUseCase } from "../useCases/credor/CreateCredorUseCase";
import { UpdateCredorUseCase } from "../useCases/credor/UpdateCredorUseCase";

export const credorService = {
  search: new SearchCredoresUseCase(credorRepository),
  create: new CreateCredorUseCase(credorRepository),
  update: new UpdateCredorUseCase(credorRepository),
};
