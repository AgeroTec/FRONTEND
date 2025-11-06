import { ICredorRepository } from "@/domain/repositories/ICredorRepository";
import { Credor } from "@/domain/entities/Credor";
import {
  createCredorSchema,
  CreateCredorInput,
} from "@/domain/schemas/credorSchemas";

function sanitizeCreateInput(data: CreateCredorInput): CreateCredorInput {
  const document = data.cnpj ?? data.cpf ?? "";
  const numericDocument = document ? document.replace(/\D/g, "") : "";

  return {
    ...data,
    nome: data.nome.trim(),
    fantasia: data.fantasia?.trim() || null,
    cnpj: data.cnpj ? numericDocument : null,
    cpf: data.cpf ? numericDocument : null,
    ativo: data.ativo,
  };
}

export class CreateCredorUseCase {
  constructor(private readonly credorRepository: ICredorRepository) {}

  async execute(data: CreateCredorInput): Promise<Credor> {
    try {
      const payload = createCredorSchema.parse(sanitizeCreateInput(data));
      return await this.credorRepository.create(payload);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro ao criar credor");
    }
  }
}
