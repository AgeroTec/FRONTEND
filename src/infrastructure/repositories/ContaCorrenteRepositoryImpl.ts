import { ContaCorrente, ContaCorrenteSearchParams } from "@/domain/entities/ContaCorrente";
import { IContaCorrenteRepository } from "@/domain/repositories/IContaCorrenteRepository";
import { PagedResult } from "@/domain/types/Common";
import { apiClient } from "../http/apiClient";
import { isApiError } from "../http/apiErrors";

interface ContaCorrenteApiItem {
  codigo?: number;
  id?: number;
  cdContaCorrente?: number;
  nomeconta?: string;
  nomeConta?: string;
  cdempresa?: number;
  cdEmpresa?: number;
  nomeempresa?: string;
  nomeEmpresa?: string;
  banco?: string;
  codigoBanco?: string;
  agencia?: string;
  conta?: string;
  digito?: string;
  tipoConta?: string;
  titular?: string;
  cnpjTitular?: string;
  tipoPessoa?: string;
  saldoInicial?: number;
  dataAbertura?: string;
  ativo?: string;
  dataCadastro?: string;
  dataAtualizacao?: string;
  CdContaCorrente?: number;
  NmConta?: string;
  NmBanco?: string;
  NuAgencia?: string;
  NuConta?: string;
  NuDigitoConta?: string;
  FlAtivo?: string;
}

type ContaCorrenteApiSearchResponse = Partial<PagedResult<ContaCorrenteApiItem>> & {
  data?: ContaCorrenteApiItem[];
  itens?: ContaCorrenteApiItem[];
  records?: ContaCorrenteApiItem[];
  totalCount?: number;
};

export class ContaCorrenteRepositoryImpl implements IContaCorrenteRepository {
  private readonly basePaths = [
    "/contas-corrente",
    "/contas-correntes",
    "/contascorrentes",
    "/conta-correntes",
    "/contas-corrente",
    "/contascorrente",
    "/conta-corrente",
    "/contacorrente",
  ];

  private mapToDomain(item: ContaCorrenteApiItem): ContaCorrente {
    return {
      codigo: item.codigo ?? item.id ?? item.cdContaCorrente ?? item.CdContaCorrente,
      nomeconta: item.nomeconta ?? item.nomeConta ?? item.NmConta ?? "",
      cdempresa: item.cdempresa ?? item.cdEmpresa,
      nomeempresa: item.nomeempresa ?? item.nomeEmpresa,
      banco: item.banco ?? item.NmBanco,
      codigoBanco: item.codigoBanco,
      agencia: item.agencia ?? item.NuAgencia,
      conta: item.conta ?? item.NuConta,
      digito: item.digito ?? item.NuDigitoConta,
      tipoConta: item.tipoConta,
      titular: item.titular,
      cnpjTitular: item.cnpjTitular,
      tipoPessoa: item.tipoPessoa,
      saldoInicial: item.saldoInicial,
      dataAbertura: item.dataAbertura,
      ativo: item.ativo ?? item.FlAtivo ?? "S",
      dataCadastro: item.dataCadastro,
      dataAtualizacao: item.dataAtualizacao,
    };
  }

  private mapToApiPayload(contaCorrente: ContaCorrente): {
    NmConta: string;
    NmBanco: string;
    NuAgencia: string;
    NuConta: string;
    NuDigitoConta?: string;
  } {
    return {
      NmConta: contaCorrente.nomeconta?.trim() ?? "",
      NmBanco: contaCorrente.banco?.trim() ?? "",
      NuAgencia: contaCorrente.agencia?.trim() ?? "",
      NuConta: contaCorrente.conta?.trim() ?? "",
      NuDigitoConta: contaCorrente.digito?.trim() || undefined,
    };
  }

  private async tryWithFallback<T>(
    action: (basePath: string) => Promise<T>,
    featureActionDescription: string
  ): Promise<T> {
    const triedPaths: string[] = [];

    for (const basePath of this.basePaths) {
      triedPaths.push(basePath);
      try {
        return await action(basePath);
      } catch (error) {
        if (!isApiError(error) || error.status !== 404) {
          throw error;
        }
      }
    }

    throw new Error(
      `O endpoint de contas correntes nao esta disponivel no backend. Nao foi possivel ${featureActionDescription}. Rotas testadas: ${triedPaths.join(", ")}`
    );
  }

  async search(params: ContaCorrenteSearchParams): Promise<PagedResult<ContaCorrente>> {
    const queryParams = new URLSearchParams();

    const searchTerm = params.searchTerm || params.nomeconta || params.codigo || params.banco || params.conta;
    if (searchTerm) queryParams.append("searchTerm", searchTerm);
    if (params.ativo) queryParams.append("ativo", params.ativo);
    if (params.page) queryParams.append("page", String(params.page));
    if (params.pageSize) queryParams.append("pageSize", String(params.pageSize));

    const rawResponse = await this.tryWithFallback(
      (basePath) => {
        const url = `${basePath}?${queryParams.toString()}`;
        return apiClient.get<ContaCorrenteApiSearchResponse | ContaCorrenteApiItem[]>(url);
      },
      "pesquisar contas correntes"
    );

    if (Array.isArray(rawResponse)) {
      const items = rawResponse.map((item) => this.mapToDomain(item));
      const page = Number(params.page) > 0 ? Number(params.page) : 1;
      const pageSize = Number(params.pageSize) > 0 ? Number(params.pageSize) : Math.max(items.length, 1);
      return {
        items,
        total: items.length,
        page,
        pageSize,
      };
    }

    const itemsSource = Array.isArray(rawResponse.items)
      ? rawResponse.items
      : Array.isArray(rawResponse.data)
        ? rawResponse.data
        : Array.isArray(rawResponse.itens)
          ? rawResponse.itens
          : Array.isArray(rawResponse.records)
            ? rawResponse.records
            : [];

    const items = itemsSource.map((item) => this.mapToDomain(item));

    return {
      items,
      total:
        typeof rawResponse.total === "number"
          ? rawResponse.total
          : typeof rawResponse.totalCount === "number"
            ? rawResponse.totalCount
            : items.length,
      page: typeof rawResponse.page === "number" ? rawResponse.page : Number(params.page) || 1,
      pageSize:
        typeof rawResponse.pageSize === "number"
          ? rawResponse.pageSize
          : Number(params.pageSize) || Math.max(items.length, 1),
    };
  }

  async getById(id: number): Promise<ContaCorrente> {
    return await this.tryWithFallback(
      async (basePath) => {
        const response = await apiClient.get<ContaCorrenteApiItem>(`${basePath}/${id}`);
        return this.mapToDomain(response);
      },
      "consultar a conta corrente"
    );
  }

  async create(contaCorrente: ContaCorrente): Promise<ContaCorrente> {
    return await this.tryWithFallback(
      async (basePath) => {
        const response = await apiClient.post<ContaCorrenteApiItem>(basePath, this.mapToApiPayload(contaCorrente));
        return this.mapToDomain(response);
      },
      "cadastrar a conta corrente"
    );
  }

  async update(id: number, contaCorrente: ContaCorrente): Promise<ContaCorrente> {
    return await this.tryWithFallback(
      async (basePath) => {
        await apiClient.put<void>(`${basePath}/${id}`, this.mapToApiPayload(contaCorrente));
        const refreshed = await apiClient.get<ContaCorrenteApiItem>(`${basePath}/${id}`);
        return this.mapToDomain(refreshed);
      },
      "atualizar a conta corrente"
    );
  }

  async delete(id: number): Promise<void> {
    await this.tryWithFallback(
      (basePath) => apiClient.delete(`${basePath}/${id}`),
      "excluir a conta corrente"
    );
  }
}
