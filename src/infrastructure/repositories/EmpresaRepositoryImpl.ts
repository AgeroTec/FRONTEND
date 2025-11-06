import { IEmpresaRepository } from "@/domain/repositories/IEmpresaRepository";
import { Empresa, EmpresaSearchParams, PagedResult } from "@/domain/entities/Empresa";
import { apiClient } from "../http/apiClient";

export class EmpresaRepositoryImpl implements IEmpresaRepository {
  private readonly baseUrl = "/empresas";

  async search(params: EmpresaSearchParams): Promise<PagedResult<Empresa>> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, String(value));
      }
    });

    const response = await apiClient.get<PagedResult<Empresa>>(
      `${this.baseUrl}?${queryParams.toString()}`
    );

    return response;
  }

  async getById(id: number): Promise<Empresa> {
    return await apiClient.get<Empresa>(`${this.baseUrl}/${id}`);
  }

  async create(empresa: Empresa): Promise<Empresa> {
    return await apiClient.post<Empresa>(this.baseUrl, empresa);
  }

  async update(id: number, empresa: Empresa): Promise<Empresa> {
    return await apiClient.put<Empresa>(`${this.baseUrl}/${id}`, empresa);
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }
}

export const empresaRepository = new EmpresaRepositoryImpl();
