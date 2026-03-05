import { ICentroCustoRepository } from "@/domain/repositories/ICentroCustoRepository";
import { CentroCusto, CentroCustoSearchParams } from "@/domain/entities/CentroCusto";
import { PagedResult } from "@/domain/types/Common";
import { apiClient } from "../http/apiClient";

interface CentroCustoApiItem {
  id?: number;
  nome?: string;
  ativo?: string;
}

interface CentroCustoApiCreateOrUpdate {
  nome: string;
  ativo?: string;
}

export class CentroCustoRepositoryImpl implements ICentroCustoRepository {
  private readonly baseUrl = "/centros-custo";

  private mapToDomain(item: CentroCustoApiItem): CentroCusto {
    return {
      codigo: item.id,
      nomecentrocusto: item.nome || "",
      ativo: item.ativo || "S",
    };
  }

  async search(params: CentroCustoSearchParams): Promise<PagedResult<CentroCusto>> {
    const queryParams = new URLSearchParams();
    const searchTerm = params.nomecentrocusto || params.nomeempresa || params.codigo;

    if (searchTerm) queryParams.append("searchTerm", String(searchTerm));
    if (params.page) queryParams.append("page", String(params.page));
    if (params.pageSize) queryParams.append("pageSize", String(params.pageSize));
    if (params.ativo) queryParams.append("ativo", params.ativo);

    const response = await apiClient.get<PagedResult<CentroCustoApiItem>>(
      `${this.baseUrl}?${queryParams.toString()}`
    );

    return {
      items: response.items.map((item) => this.mapToDomain(item)),
      page: response.page,
      pageSize: response.pageSize,
      total: response.total,
    };
  }

  async getById(id: number): Promise<CentroCusto> {
    const response = await apiClient.get<CentroCustoApiItem>(`${this.baseUrl}/${id}`);
    return this.mapToDomain(response);
  }

  async create(centroCusto: CentroCusto): Promise<CentroCusto> {
    const payload: CentroCustoApiCreateOrUpdate = {
      nome: centroCusto.nomecentrocusto,
    };

    const response = await apiClient.post<CentroCustoApiItem>(this.baseUrl, payload);
    return this.mapToDomain(response);
  }

  async update(id: number, centroCusto: CentroCusto): Promise<CentroCusto> {
    const payload: CentroCustoApiCreateOrUpdate = {
      nome: centroCusto.nomecentrocusto,
      ativo: centroCusto.ativo,
    };

    await apiClient.put<void>(`${this.baseUrl}/${id}`, payload);
    const refreshed = await this.getById(id);
    return refreshed;
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }
}

