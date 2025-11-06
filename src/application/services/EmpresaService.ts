import { empresaRepository } from "@/infrastructure/repositories/EmpresaRepositoryImpl";
import { SearchEmpresasUseCase } from "../useCases/empresa/SearchEmpresasUseCase";
import { GetEmpresaByIdUseCase } from "../useCases/empresa/GetEmpresaByIdUseCase";
import { CreateEmpresaUseCase } from "../useCases/empresa/CreateEmpresaUseCase";
import { UpdateEmpresaUseCase } from "../useCases/empresa/UpdateEmpresaUseCase";
import { DeleteEmpresaUseCase } from "../useCases/empresa/DeleteEmpresaUseCase";

export const empresaService = {
  search: new SearchEmpresasUseCase(empresaRepository),
  getById: new GetEmpresaByIdUseCase(empresaRepository),
  create: new CreateEmpresaUseCase(empresaRepository),
  update: new UpdateEmpresaUseCase(empresaRepository),
  delete: new DeleteEmpresaUseCase(empresaRepository),
};
