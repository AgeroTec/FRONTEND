import { Credor, CredorSearchParams } from "@/domain/entities/Credor";
import { ICredorRepository } from "@/domain/repositories/ICredorRepository";
import { PagedResult } from "@/domain/types/Common";
import { apiClient } from "../http/apiClient";

export class CredorRepositoryImpl implements ICredorRepository {
  private readonly baseUrl = "/credores";

  async search(params: CredorSearchParams): Promise<PagedResult<Credor>> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, String(value));
      }
    });

    const response = await apiClient.get<PagedResult<Credor>>(
      `${this.baseUrl}?${queryParams.toString()}`
    );
    return response;
  }

  async getById(id: number): Promise<Credor> {
    return await apiClient.get<Credor>(`${this.baseUrl}/${id}`);
  }

  async create(credor: Credor): Promise<Credor> {
    return await apiClient.post<Credor>(this.baseUrl, credor);
  }

  async update(id: number, credor: Credor): Promise<Credor> {
    return await apiClient.put<Credor>(`${this.baseUrl}/${id}`, credor);
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }
}

export const credorRepository = new CredorRepositoryImpl();
