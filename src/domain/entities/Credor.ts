export interface Credor {
  id: number;
  nome: string;
  fantasia: string | null;
  cnpj: string | null;
  cpf: string | null;
  ativo: string;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export class CredorHelper {
  static getDisplayName(credor: Credor): string {
    return credor.fantasia || credor.nome;
  }

  static getDocument(credor: Credor): string | null {
    return credor.cnpj || credor.cpf;
  }

  static isActive(credor: Credor): boolean {
    return credor.ativo === 'S';
  }

  static canBeDeleted(credor: Credor): boolean {
    return !this.isActive(credor);
  }

  static getStatusLabel(credor: Credor): string {
    return this.isActive(credor) ? 'Ativo' : 'Inativo';
  }

  static getStatusBadgeClass(credor: Credor): string {
    return this.isActive(credor)
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  }
}