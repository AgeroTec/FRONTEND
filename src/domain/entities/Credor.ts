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
