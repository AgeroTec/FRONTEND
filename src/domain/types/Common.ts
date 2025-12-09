export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface SearchFilters extends PaginationParams {
  [key: string]: string | number | boolean | undefined;
}
