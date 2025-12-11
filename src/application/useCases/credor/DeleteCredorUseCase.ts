import { ICredorRepository } from "@/domain/repositories/ICredorRepository";

export class DeleteCredorUseCase {
  constructor(private readonly credorRepository: ICredorRepository) {}

  async execute(id: number): Promise<void> {
    try {
      if (!id || id <= 0) {
        throw new Error("ID inválido");
      }

      await this.credorRepository.delete(id);
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Erro ao excluir credor");
    }
  }
}
