import { ICredorRepository, CredorSearchParams } from '@/domain/repositories/ICredorRepository';
import { Credor, PagedResult } from '@/domain/entities/Credor';
import { httpClient } from '../http/httpClient';

export class CredorRepositoryImpl implements ICredorRepository {
  private readonly basePath = '/credores';

  async search(params: CredorSearchParams): Promise<PagedResult<Credor>> {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
    });

    if (params.search) {
      queryParams.append('search', params.search);
    }

    if (params.doc) {
      queryParams.append('doc', params.doc);
    }

    if (params.ativo) {
      queryParams.append('ativo', params.ativo);
    }

    return httpClient.get<PagedResult<Credor>>(
      `${this.basePath}?${queryParams.toString()}`
    );
  }

  async findById(id: number): Promise<Credor> {
    return httpClient.get<Credor>(`${this.basePath}/${id}`);
  }

  async create(credor: Omit<Credor, 'id'>): Promise<Credor> {
    return httpClient.post<Credor>(this.basePath, credor);
  }

  async update(id: number, credor: Partial<Credor>): Promise<Credor> {
    return httpClient.put<Credor>(`${this.basePath}/${id}`, credor);
  }

  async delete(id: number): Promise<void> {
    return httpClient.delete<void>(`${this.basePath}/${id}`);
  }
}
