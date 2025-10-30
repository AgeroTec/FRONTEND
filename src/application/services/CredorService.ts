import { CredorRepositoryImpl } from '@/infrastructure/repositories/CredorRepositoryImpl';
import { SearchCredoresUseCase } from '../useCases/credor/SearchCredoresUseCase';
import { CreateCredorUseCase, CreateCredorDTO } from '../useCases/credor/CreateCredorUseCase';
import { CredorSearchParams } from '@/domain/repositories/ICredorRepository';
import { Credor } from '@/domain/entities/Credor';

export class CredorService {
  private readonly repository = new CredorRepositoryImpl();
  private readonly searchUseCase = new SearchCredoresUseCase(this.repository);
  private readonly createUseCase = new CreateCredorUseCase(this.repository);

  async search(params: CredorSearchParams) {
    return this.searchUseCase.execute(params);
  }

  async findById(id: number): Promise<Credor> {
    return this.repository.findById(id);
  }

  async create(data: CreateCredorDTO) {
    return this.createUseCase.execute(data);
  }

  async update(id: number, data: Partial<Credor>): Promise<Credor> {
    return this.repository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    return this.repository.delete(id);
  }
}

export const credorService = new CredorService();
