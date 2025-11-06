import { ICentroCustoRepository } from "@/domain/repositories/ICentroCustoRepository";
import { CentroCusto, CentroCustoSearchParams, PagedResult } from "@/domain/entities/CentroCusto";
import { apiClient } from "../http/apiClient";

export class CentroCustoRepositoryImpl implements ICentroCustoRepository {
  private readonly baseUrl = "/centrodecusto";

  async search(params: CentroCustoSearchParams): Promise<PagedResult<CentroCusto>> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, String(value));
      }
    });

    const response = await apiClient.get<PagedResult<CentroCusto>>(
      `${this.baseUrl}?${queryParams.toString()}`
    );

    return response;
  }

  async getById(id: number): Promise<CentroCusto> {
    return await apiClient.get<CentroCusto>(`${this.baseUrl}/${id}`);
  }

  async create(centroCusto: CentroCusto): Promise<CentroCusto> {
    return await apiClient.post<CentroCusto>(this.baseUrl, centroCusto);
  }

  async update(id: number, centroCusto: CentroCusto): Promise<CentroCusto> {
    return await apiClient.put<CentroCusto>(`${this.baseUrl}/${id}`, centroCusto);
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }
}

export const centroCustoRepository = new CentroCustoRepositoryImpl();
