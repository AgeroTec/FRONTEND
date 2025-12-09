import { IClienteRepository } from "@/domain/repositories/IClienteRepository";
import { Cliente, ClienteSearchParams } from "@/domain/entities/Cliente";
import { PagedResult } from "@/domain/types/Common";
import { apiClient } from "../http/apiClient";

export class ClienteRepositoryImpl implements IClienteRepository {
  private readonly baseUrl = "/clientes";

  async search(params: ClienteSearchParams): Promise<PagedResult<Cliente>> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, String(value));
      }
    });

    const response = await apiClient.get<PagedResult<Cliente>>(
      `${this.baseUrl}?${queryParams.toString()}`
    );

    return response;
  }

  async getById(id: number): Promise<Cliente> {
    return await apiClient.get<Cliente>(`${this.baseUrl}/${id}`);
  }

  async create(cliente: Cliente): Promise<Cliente> {
    return await apiClient.post<Cliente>(this.baseUrl, cliente);
  }

  async update(id: number, cliente: Cliente): Promise<Cliente> {
    return await apiClient.put<Cliente>(`${this.baseUrl}/${id}`, cliente);
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }
}

export const clienteRepository = new ClienteRepositoryImpl();
