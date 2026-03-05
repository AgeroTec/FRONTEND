import { LoginUseCase } from "@/application/useCases/auth/LoginUseCase";
import { LogoutUseCase } from "@/application/useCases/auth/LogoutUseCase";
import { RefreshTokenUseCase } from "@/application/useCases/auth/RefreshTokenUseCase";
import { ValidateTokenUseCase } from "@/application/useCases/auth/ValidateTokenUseCase";
import { CreateCentroCustoUseCase } from "@/application/useCases/centrocusto/CreateCentroCustoUseCase";
import { SearchCentroCustosUseCase } from "@/application/useCases/centrocusto/SearchCentroCustosUseCase";
import { CreateClienteUseCase } from "@/application/useCases/cliente/CreateClienteUseCase";
import { SearchClientesUseCase } from "@/application/useCases/cliente/SearchClientesUseCase";
import { CreateContaCorrenteUseCase } from "@/application/useCases/contacorrente/CreateContaCorrenteUseCase";
import { SearchContasCorrentesUseCase } from "@/application/useCases/contacorrente/SearchContasCorrentesUseCase";
import { CreateCredorUseCase } from "@/application/useCases/credor/CreateCredorUseCase";
import { DeleteCredorUseCase } from "@/application/useCases/credor/DeleteCredorUseCase";
import { PatchCredorUseCase } from "@/application/useCases/credor/PatchCredorUseCase";
import { SearchCredoresUseCase } from "@/application/useCases/credor/SearchCredoresUseCase";
import { ToggleCredorStatusUseCase } from "@/application/useCases/credor/ToggleCredorStatusUseCase";
import { UpdateCredorUseCase } from "@/application/useCases/credor/UpdateCredorUseCase";
import { CreateEmpresaUseCase } from "@/application/useCases/empresa/CreateEmpresaUseCase";
import { DeleteEmpresaUseCase } from "@/application/useCases/empresa/DeleteEmpresaUseCase";
import { GetEmpresaByIdUseCase } from "@/application/useCases/empresa/GetEmpresaByIdUseCase";
import { SearchEmpresasUseCase } from "@/application/useCases/empresa/SearchEmpresasUseCase";
import { UpdateEmpresaUseCase } from "@/application/useCases/empresa/UpdateEmpresaUseCase";
import { GetCurrentTenantUseCase } from "@/application/useCases/tenant/GetCurrentTenantUseCase";
import { AuthRepositoryImpl } from "@/infrastructure/repositories/AuthRepositoryImpl";
import { CentroCustoRepositoryImpl } from "@/infrastructure/repositories/CentroCustoRepositoryImpl";
import { ClienteRepositoryImpl } from "@/infrastructure/repositories/ClienteRepositoryImpl";
import { ContaCorrenteRepositoryImpl } from "@/infrastructure/repositories/ContaCorrenteRepositoryImpl";
import { CredorRepositoryImpl } from "@/infrastructure/repositories/CredorRepositoryImpl";
import { EmpresaRepositoryImpl } from "@/infrastructure/repositories/EmpresaRepositoryImpl";
import { TenantRepositoryImpl } from "@/infrastructure/repositories/TenantRepositoryImpl";

const authRepository = new AuthRepositoryImpl();
const centroCustoRepository = new CentroCustoRepositoryImpl();
const clienteRepository = new ClienteRepositoryImpl();
const contaCorrenteRepository = new ContaCorrenteRepositoryImpl();
const credorRepository = new CredorRepositoryImpl();
const empresaRepository = new EmpresaRepositoryImpl();
const tenantRepository = new TenantRepositoryImpl();

export const authService = {
  login: new LoginUseCase(authRepository),
  logout: new LogoutUseCase(authRepository),
  refreshToken: new RefreshTokenUseCase(authRepository),
  validateToken: new ValidateTokenUseCase(authRepository),
};

export const centroCustoService = {
  search: new SearchCentroCustosUseCase(centroCustoRepository),
  create: new CreateCentroCustoUseCase(centroCustoRepository),
};

export const clienteService = {
  search: new SearchClientesUseCase(clienteRepository),
  create: new CreateClienteUseCase(clienteRepository),
};

export const contaCorrenteService = {
  searchContasCorrentes: new SearchContasCorrentesUseCase(contaCorrenteRepository),
  createContaCorrente: new CreateContaCorrenteUseCase(contaCorrenteRepository),
};

export const credorService = {
  search: new SearchCredoresUseCase(credorRepository),
  create: new CreateCredorUseCase(credorRepository),
  update: new UpdateCredorUseCase(credorRepository),
  patch: new PatchCredorUseCase(credorRepository),
  delete: new DeleteCredorUseCase(credorRepository),
  toggleStatus: new ToggleCredorStatusUseCase(credorRepository),
};

export const empresaService = {
  search: new SearchEmpresasUseCase(empresaRepository),
  getById: new GetEmpresaByIdUseCase(empresaRepository),
  create: new CreateEmpresaUseCase(empresaRepository),
  update: new UpdateEmpresaUseCase(empresaRepository),
  delete: new DeleteEmpresaUseCase(empresaRepository),
};

export const tenantService = {
  getCurrent: new GetCurrentTenantUseCase(tenantRepository),
};
