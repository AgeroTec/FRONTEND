import { Credor, PagedResult } from "@/domain/entities/Credor";
import {
  CredorSearchInput,
  CreateCredorInput,
} from "@/domain/schemas/credorSchemas";

export interface ICredorRepository {
  search(params: CredorSearchInput): Promise<PagedResult<Credor>>;
  create(data: CreateCredorInput): Promise<Credor>;
}
