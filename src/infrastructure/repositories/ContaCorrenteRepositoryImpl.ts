import { ContaCorrente, ContaCorrenteSearchParams } from "@/domain/entities/ContaCorrente";
import { IContaCorrenteRepository } from "@/domain/repositories/IContaCorrenteRepository";
import { PagedResult } from "@/domain/types/Common";
import { apiClient } from "../http/apiClient";

export class ContaCorrenteRepositoryImpl implements IContaCorrenteRepository {
  private readonly basePath = "/contascorrentes";

  async search(params: ContaCorrenteSearchParams): Promise<PagedResult<ContaCorrente>> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${this.basePath}?${queryParams.toString()}`;
    return await apiClient.get<PagedResult<ContaCorrente>>(url);
  }

  async getById(id: number): Promise<ContaCorrente> {
    return await apiClient.get<ContaCorrente>(`${this.basePath}/${id}`);
  }

  async create(contaCorrente: ContaCorrente): Promise<ContaCorrente> {
    return await apiClient.post<ContaCorrente>(this.basePath, contaCorrente);
  }

  async update(id: number, contaCorrente: ContaCorrente): Promise<ContaCorrente> {
    return await apiClient.put<ContaCorrente>(`${this.basePath}/${id}`, contaCorrente);
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`);
  }
}
