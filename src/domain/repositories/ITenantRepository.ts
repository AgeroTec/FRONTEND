import { TenantInfo } from "@/domain/entities/Tenant";

export interface ITenantRepository {
  getCurrent(): Promise<TenantInfo>;
}

