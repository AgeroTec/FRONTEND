import { ICredorRepository, CredorSearchParams } from '@/domain/repositories/ICredorRepository';
import { PagedResult, Credor } from '@/domain/entities/Credor';
import { credorSearchSchema } from '@/domain/schemas/credorSchemas';

export class SearchCredoresUseCase {
  constructor(private readonly repository: ICredorRepository) {}

  async execute(params: CredorSearchParams): Promise<PagedResult<Credor>> {
    const validated = credorSearchSchema.parse(params);
    return this.repository.search(validated);
  }
}
