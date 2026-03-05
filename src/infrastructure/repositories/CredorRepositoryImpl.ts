import { Credor, CredorSearchParams } from "@/domain/entities/Credor";
import { ICredorRepository } from "@/domain/repositories/ICredorRepository";
import { PagedResult } from "@/domain/types/Common";
import { apiClient } from "../http/apiClient";

interface CredorApiResponse {
  id?: number;
  cdContaCorrente?: number;
  CdContaCorrente?: number;
  nome: string;
  fantasia?: string;
  cnpj?: string;
  cpf?: string;
  ativo: string;
  tipoPessoa?: string;
  tipoCredor?: string;
  microempresa?: boolean;
  transportadora?: boolean;
  estrangeiro?: boolean;
  dataCadastro?: string;
  dataAtualizacao?: string;
}

export class CredorRepositoryImpl implements ICredorRepository {
  private readonly baseUrl = "/credores";

  private mapToDomain(apiCredor?: CredorApiResponse): Credor {
    if (!apiCredor) {
      throw new Error("Resposta invalida do backend para credor.");
    }

    return {
      codigo: apiCredor.id,
      cdContaCorrente: apiCredor.cdContaCorrente ?? apiCredor.CdContaCorrente,
      nome: apiCredor.nome,
      fantasia: apiCredor.fantasia,
      cnpj: apiCredor.cnpj,
      cpf: apiCredor.cpf,
      ativo: apiCredor.ativo,
      tipoPessoa: apiCredor.tipoPessoa as "fisica" | "juridica" | undefined,
      tipoCredor: apiCredor.tipoCredor as "corretor" | "fornecedor" | "prestador" | "cliente" | "parceiro" | undefined,
      microempresa: apiCredor.microempresa,
      transportadora: apiCredor.transportadora,
      estrangeiro: apiCredor.estrangeiro,
      dataCadastro: apiCredor.dataCadastro,
      dataAtualizacao: apiCredor.dataAtualizacao,
    };
  }

  private mapToApi(credor: Credor): CredorApiResponse {
    return {
      id: credor.codigo,
      cdContaCorrente: credor.cdContaCorrente,
      nome: credor.nome,
      fantasia: credor.fantasia,
      cnpj: credor.cnpj,
      cpf: credor.cpf,
      ativo: credor.ativo,
      tipoPessoa: credor.tipoPessoa,
      tipoCredor: credor.tipoCredor,
      microempresa: credor.microempresa,
      transportadora: credor.transportadora,
      estrangeiro: credor.estrangeiro,
      dataCadastro: credor.dataCadastro,
      dataAtualizacao: credor.dataAtualizacao,
    };
  }

  async search(params: CredorSearchParams): Promise<PagedResult<Credor>> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, String(value));
      }
    });

    const response = await apiClient.get<Partial<PagedResult<CredorApiResponse>> & {
      data?: CredorApiResponse[];
      itens?: CredorApiResponse[];
      records?: CredorApiResponse[];
      totalCount?: number;
    }>(
      `${this.baseUrl}?${queryParams.toString()}`
    );

    const itemsSource = Array.isArray(response.items)
      ? response.items
      : Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.itens)
          ? response.itens
          : Array.isArray(response.records)
            ? response.records
        : [];

    const items = itemsSource
      .filter((item): item is CredorApiResponse => !!item)
      .map((item) => this.mapToDomain(item));

    const total =
      typeof response.total === "number"
        ? response.total
        : typeof response.totalCount === "number"
          ? response.totalCount
          : items.length;

    return {
      items,
      total,
      page: typeof response.page === "number" ? response.page : 1,
      pageSize: typeof response.pageSize === "number" ? response.pageSize : Math.max(items.length, 1),
    };
  }

  async getById(id: number): Promise<Credor> {
    const response = await apiClient.get<CredorApiResponse>(`${this.baseUrl}/${id}`);
    return this.mapToDomain(response);
  }

  async create(credor: Credor): Promise<Credor> {
    const payload = this.mapToApi(credor);
    const response = await apiClient.post<CredorApiResponse>(this.baseUrl, payload);
    return this.mapToDomain(response);
  }

  async update(id: number, credor: Credor): Promise<Credor> {
    const payload = this.mapToApi(credor);
    const response = await apiClient.put<CredorApiResponse>(`${this.baseUrl}/${id}`, payload);
    return this.mapToDomain(response);
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }

  async patch(id: number, data: Partial<Credor>): Promise<Credor> {
    if (data.ativo !== undefined && Object.keys(data).length === 1) {
      const response = await apiClient.patch<CredorApiResponse | undefined>(
        `${this.baseUrl}/${id}/ativo`,
        { valor: data.ativo }
      );

      if (response) {
        return this.mapToDomain(response);
      }

      return await this.getById(id);
    }

    const payload: Partial<CredorApiResponse> = {};

    if (data.codigo !== undefined) payload.id = data.codigo;
    if (data.cdContaCorrente !== undefined) payload.cdContaCorrente = data.cdContaCorrente;
    if (data.nome !== undefined) payload.nome = data.nome;
    if (data.fantasia !== undefined) payload.fantasia = data.fantasia;
    if (data.cnpj !== undefined) payload.cnpj = data.cnpj;
    if (data.cpf !== undefined) payload.cpf = data.cpf;
    if (data.ativo !== undefined) payload.ativo = data.ativo;
    if (data.tipoPessoa !== undefined) payload.tipoPessoa = data.tipoPessoa;
    if (data.tipoCredor !== undefined) payload.tipoCredor = data.tipoCredor;
    if (data.microempresa !== undefined) payload.microempresa = data.microempresa;
    if (data.transportadora !== undefined) payload.transportadora = data.transportadora;
    if (data.estrangeiro !== undefined) payload.estrangeiro = data.estrangeiro;
    if (data.dataCadastro !== undefined) payload.dataCadastro = data.dataCadastro;
    if (data.dataAtualizacao !== undefined) payload.dataAtualizacao = data.dataAtualizacao;

    const response = await apiClient.patch<CredorApiResponse | undefined>(`${this.baseUrl}/${id}`, payload);
    if (response) {
      return this.mapToDomain(response);
    }

    return await this.getById(id);
  }
}
