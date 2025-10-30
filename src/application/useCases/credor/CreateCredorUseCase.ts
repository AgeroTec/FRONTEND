import { ICredorRepository } from '@/domain/repositories/ICredorRepository';
import { Credor } from '@/domain/entities/Credor';
import { createCredorSchema } from '@/domain/schemas/credorSchemas';
import { z } from 'zod';

export type CreateCredorDTO = z.infer<typeof createCredorSchema>;

export class CreateCredorUseCase {
  constructor(private readonly repository: ICredorRepository) {}

  async execute(data: CreateCredorDTO): Promise<Credor> {
    const validated = createCredorSchema.parse(data);

    if (!validated.cnpj && !validated.cpf) {
      throw new Error('Informe CPF ou CNPJ');
    }

    return this.repository.create(validated as Omit<Credor, 'id'>);
  }
}
