import { IEmpresaRepository } from "@/domain/repositories/IEmpresaRepository";

export class DeleteEmpresaUseCase {
  constructor(private readonly empresaRepository: IEmpresaRepository) {}

  async execute(id: number): Promise<void> {
    try {
      await this.empresaRepository.delete(id);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro ao deletar empresa");
    }
  }
}
