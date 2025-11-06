import { clienteRepository } from "@/infrastructure/repositories/ClienteRepositoryImpl";
import { SearchClientesUseCase } from "../useCases/cliente/SearchClientesUseCase";
import { CreateClienteUseCase } from "../useCases/cliente/CreateClienteUseCase";

export const clienteService = {
  search: new SearchClientesUseCase(clienteRepository),
  create: new CreateClienteUseCase(clienteRepository),
};
