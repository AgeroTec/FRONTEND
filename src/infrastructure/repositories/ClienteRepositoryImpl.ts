import { IClienteRepository } from "@/domain/repositories/IClienteRepository";
import { Cliente, ClienteSearchParams } from "@/domain/entities/Cliente";
import { PagedResult } from "@/domain/types/Common";
import { apiClient } from "../http/apiClient";

interface ClienteApiItem {
  cdCliente?: number;
  nmCliente?: string;
  nmFantasia?: string;
  nuCpf?: string;
  nuCnpj?: string;
  nmMunicipio?: string;
  ativo?: string;
}

interface ClienteApiPayload {
  nome: string;
  nomeFantasia?: string;
  tipoPessoa: "F" | "J";
  cpf?: string;
  cnpj?: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  email?: string;
  telefone?: string;
  municipioId?: number;
  estadoCivilId?: number;
  cep?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  ativo?: string;
}

export class ClienteRepositoryImpl implements IClienteRepository {
  private readonly baseUrl = "/clientes";

  private mapToDomain(item: ClienteApiItem): Cliente {
    return {
      codigo: item.cdCliente,
      razaoSocial: item.nmCliente || "",
      nomeFantasia: item.nmFantasia,
      cpf: item.nuCpf,
      cnpj: item.nuCnpj,
      municipio: item.nmMunicipio,
      ativo: item.ativo || "S",
    };
  }

  private mapToApi(cliente: Cliente): ClienteApiPayload {
    const hasCnpj = !!cliente.cnpj?.trim();

    return {
      nome: cliente.razaoSocial,
      nomeFantasia: cliente.nomeFantasia || undefined,
      tipoPessoa: hasCnpj ? "J" : "F",
      cpf: cliente.cpf || undefined,
      cnpj: cliente.cnpj || undefined,
      inscricaoEstadual: cliente.inscricaoEstadual || undefined,
      inscricaoMunicipal: cliente.inscricaoMunicipal || undefined,
      email: cliente.email || undefined,
      telefone: cliente.telefone || cliente.celular || undefined,
      cep: cliente.cep || undefined,
      endereco: cliente.endereco || undefined,
      numero: cliente.numero || undefined,
      complemento: cliente.complemento || undefined,
      bairro: cliente.bairro || undefined,
      ativo: cliente.ativo || undefined,
    };
  }

  async search(params: ClienteSearchParams): Promise<PagedResult<Cliente>> {
    const queryParams = new URLSearchParams();
    const searchTerm = params.razaoSocial || params.nomeFantasia || params.cnpjCpf || params.codigo;

    if (searchTerm) queryParams.append("searchTerm", String(searchTerm));
    if (params.page) queryParams.append("page", String(params.page));
    if (params.pageSize) queryParams.append("pageSize", String(params.pageSize));
    if (params.ativo) {
      const normalizedAtivo = params.ativo === "true" ? "S" : params.ativo === "false" ? "N" : params.ativo;
      queryParams.append("ativo", normalizedAtivo);
    }

    const response = await apiClient.get<PagedResult<ClienteApiItem>>(
      `${this.baseUrl}?${queryParams.toString()}`
    );

    return {
      items: response.items.map((item) => this.mapToDomain(item)),
      page: response.page,
      pageSize: response.pageSize,
      total: response.total,
    };
  }

  async getById(id: number): Promise<Cliente> {
    const response = await apiClient.get<ClienteApiItem>(`${this.baseUrl}/${id}`);
    return this.mapToDomain(response);
  }

  async create(cliente: Cliente): Promise<Cliente> {
    const response = await apiClient.post<ClienteApiItem>(this.baseUrl, this.mapToApi(cliente));
    return this.mapToDomain(response);
  }

  async update(id: number, cliente: Cliente): Promise<Cliente> {
    await apiClient.put<void>(`${this.baseUrl}/${id}`, this.mapToApi(cliente));
    return await this.getById(id);
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }
}

