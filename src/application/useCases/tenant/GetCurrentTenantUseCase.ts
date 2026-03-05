import { TenantInfo } from "@/domain/entities/Tenant";
import { ITenantRepository } from "@/domain/repositories/ITenantRepository";

export class GetCurrentTenantUseCase {
  constructor(private readonly tenantRepository: ITenantRepository) {}

  async execute(): Promise<TenantInfo> {
    try {
      return await this.tenantRepository.getCurrent();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro ao carregar tenant atual");
    }
  }
}

