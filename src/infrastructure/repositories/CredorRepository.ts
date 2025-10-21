import { Credor, PagedResult } from '@/domain/entities/Credor';
import { ICredorRepository, CredorSearchParams } from '@/domain/interfaces/ICredorRepository';
import { HttpClient } from '../api/httpClient';

export class CredorRepository implements ICredorRepository {
  private httpClient: HttpClient;
  private baseUrl = 'http://localhost:5103/api/v1/credores';

  constructor() {
    this.httpClient = new HttpClient();
  }

  async search(params: CredorSearchParams): Promise<PagedResult<Credor>> {
    const queryParams = new URLSearchParams();

    // ✅ Parâmetros OBRIGATÓRIOS
    queryParams.append('Page', params.page.toString());
    queryParams.append('PageSize', params.pageSize.toString());

    // ✅ Parâmetros OPCIONAIS
    if (params.search && params.search.trim() !== '') {
      queryParams.append('search', params.search.trim());
    }

    if (params.doc && params.doc.trim() !== '') {
      queryParams.append('doc', params.doc.trim());
    }

    if (params.ativo && params.ativo !== '') {
      queryParams.append('ativo', params.ativo);
    }

    const url = `${this.baseUrl}?${queryParams.toString()}`;
    console.log('URL final da consulta:', url);

    // ✅ Headers obrigatórios
    const headers = {
      'accept': 'application/json',
      'X-Tenant-Id': '11111111-1111-1111-1111-111111111111',
      'X-User-Id': '5f1a3c2b-9d8e-4f7a-b6c4-21a3d2f4b5c6',
      'X-User-Name': 'Maria da Silva',
      'X-Correlation-Id': 'f1e2d3c4-b5a6-7890-1234-567890abcdef',
      'Accept-Language': 'pt-BR'
    };

    // ✅ Chamada com headers incluídos
    return await this.httpClient.get<PagedResult<Credor>>(url, { headers });
  }
}
