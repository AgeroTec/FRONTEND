import { ICredorRepository } from "@/domain/repositories/ICredorRepository";
import { Credor, PagedResult } from "@/domain/entities/Credor";
import {
  CredorSearchInput,
  CreateCredorInput,
} from "@/domain/schemas/credorSchemas";
import { apiClient } from "../http/apiClient";

type CredorApiPagedResponse = {
  items?: Credor[];
  page?: number;
  pageNumber?: number;
  pageSize?: number;
  page_size?: number;
  total?: number;
  totalCount?: number;
};

function mapPagedResult(response: CredorApiPagedResponse): PagedResult<Credor> {
  return {
    items: response.items ?? [],
    page: response.page ?? response.pageNumber ?? 1,
    pageSize: response.pageSize ?? response.page_size ?? 10,
    total: response.total ?? response.totalCount ?? 0,
  };
}

export class CredorRepositoryImpl implements ICredorRepository {
  private readonly baseUrl = "/credores";

  async search(params: CredorSearchInput): Promise<PagedResult<Credor>> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, String(value));
      }
    });

    const endpoint = queryParams.toString()
      ? `${this.baseUrl}?${queryParams.toString()}`
      : this.baseUrl;

    const response = await apiClient.get<CredorApiPagedResponse>(endpoint);
    return mapPagedResult(response);
  }

  async create(data: CreateCredorInput): Promise<Credor> {
    const payload = {
      ...data,
      fantasia: data.fantasia ?? null,
      cnpj: data.cnpj ?? null,
      cpf: data.cpf ?? null,
    };

    return await apiClient.post<Credor>(this.baseUrl, payload);
  }
}

export const credorRepository = new CredorRepositoryImpl();
