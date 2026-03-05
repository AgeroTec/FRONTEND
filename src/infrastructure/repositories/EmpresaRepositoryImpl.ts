import { IEmpresaRepository } from "@/domain/repositories/IEmpresaRepository";
import { Empresa, EmpresaSearchParams } from "@/domain/entities/Empresa";
import { PagedResult } from "@/domain/types/Common";
import { apiClient } from "../http/apiClient";

interface EmpresaApiItem {
  id?: number;
  nome?: string;
  cnpj?: string;
  ativo?: string;
}

interface EmpresaApiPayload {
  nome: string;
  cnpj?: string;
  inscricaoEstadual?: string;
  municipioId?: number;
  ativa?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  numero?: number;
  bairro?: string;
  cep?: string;
}

export class EmpresaRepositoryImpl implements IEmpresaRepository {
  private readonly baseUrl = "/empresas";

  private mapToDomain(item: EmpresaApiItem): Empresa {
    return {
      codigo: item.id,
      nomeempresa: item.nome || "",
      nucnpj: item.cnpj,
      ativo: item.ativo || "S",
    };
  }

  private mapToApi(empresa: Empresa): EmpresaApiPayload {
    const numero = empresa.numero ? Number(empresa.numero) : undefined;
    const normalizedAtiva = (() => {
      const value = (empresa.ativo || "").trim().toUpperCase();
      if (value === "N" || value === "INATIVO") return "N";
      if (value === "S" || value === "ATIVO") return "S";
      return undefined;
    })();

    return {
      nome: empresa.nomeempresa,
      cnpj: empresa.nucnpj || undefined,
      inscricaoEstadual: empresa.nuinscricaoestadual || undefined,
      ativa: normalizedAtiva,
      email: empresa.email || undefined,
      telefone: empresa.telefone || undefined,
      endereco: empresa.endereco || undefined,
      numero: Number.isNaN(numero) ? undefined : numero,
      bairro: empresa.bairro || undefined,
      cep: empresa.cep || undefined,
    };
  }

  async search(params: EmpresaSearchParams): Promise<PagedResult<Empresa>> {
    const queryParams = new URLSearchParams();
    const searchTerm = params.nomeempresa || params.nucnpj || params.codigo || params.codgrupoempresa;

    if (searchTerm) queryParams.append("searchTerm", String(searchTerm));
    if (params.page) queryParams.append("page", String(params.page));
    if (params.pageSize) queryParams.append("pageSize", String(params.pageSize));

    const response = await apiClient.get<PagedResult<EmpresaApiItem>>(
      `${this.baseUrl}?${queryParams.toString()}`
    );

    return {
      items: response.items.map((item) => this.mapToDomain(item)),
      page: response.page,
      pageSize: response.pageSize,
      total: response.total,
    };
  }

  async getById(id: number): Promise<Empresa> {
    const response = await apiClient.get<EmpresaApiItem>(`${this.baseUrl}/${id}`);
    return this.mapToDomain(response);
  }

  async create(empresa: Empresa): Promise<Empresa> {
    const response = await apiClient.post<EmpresaApiItem>(this.baseUrl, this.mapToApi(empresa));
    return this.mapToDomain(response);
  }

  async update(id: number, empresa: Empresa): Promise<Empresa> {
    await apiClient.put<void>(`${this.baseUrl}/${id}`, this.mapToApi(empresa));
    return await this.getById(id);
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }
}

