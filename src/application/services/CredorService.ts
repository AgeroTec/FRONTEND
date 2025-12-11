import { credorRepository } from "@/infrastructure/repositories/CredorRepositoryImpl";
import { SearchCredoresUseCase } from "../useCases/credor/SearchCredoresUseCase";
import { CreateCredorUseCase } from "../useCases/credor/CreateCredorUseCase";
import { UpdateCredorUseCase } from "../useCases/credor/UpdateCredorUseCase";
import { PatchCredorUseCase } from "../useCases/credor/PatchCredorUseCase";
import { DeleteCredorUseCase } from "../useCases/credor/DeleteCredorUseCase";
import { ToggleCredorStatusUseCase } from "../useCases/credor/ToggleCredorStatusUseCase";

export const credorService = {
  search: new SearchCredoresUseCase(credorRepository),
  create: new CreateCredorUseCase(credorRepository),
  update: new UpdateCredorUseCase(credorRepository),
  patch: new PatchCredorUseCase(credorRepository),
  delete: new DeleteCredorUseCase(credorRepository),
  toggleStatus: new ToggleCredorStatusUseCase(credorRepository),
};
