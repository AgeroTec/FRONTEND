import { TenantInfo } from "@/domain/entities/Tenant";
import { ITenantRepository } from "@/domain/repositories/ITenantRepository";
import { apiConfig } from "@/infrastructure/http/apiConfig";
import { apiClient } from "@/infrastructure/http/apiClient";
import { ApiError } from "@/infrastructure/http/apiErrors";

interface TenantApiResponse {
  data?: TenantApiPayload;
  result?: TenantApiPayload;
  tenant?: TenantApiPayload;
  payload?: TenantApiPayload;
  value?: TenantApiPayload;
  tenantId?: string;
  TenantId?: string;
  id?: string;
  Id?: string;
  displayName?: string;
  DisplayName?: string;
  primaryCompanyName?: string;
  PrimaryCompanyName?: string;
  companyName?: string;
  CompanyName?: string;
  nomeEmpresa?: string;
  NomeEmpresa?: string;
  nmEmpresa?: string;
  NmEmpresa?: string;
  razaoSocial?: string;
  RazaoSocial?: string;
  primaryCompany?: TenantApiPayload;
  PrimaryCompany?: TenantApiPayload;
  company?: TenantApiPayload;
  Company?: TenantApiPayload;
}

type TenantApiPayload = Record<string, unknown>;

export class TenantRepositoryImpl implements ITenantRepository {
  private readonly endpoints = ["/tenant", "/tenant/current", "/tenants/current", "/tenants/me", `/tenants/${apiConfig.getTenantId()}`];

  private readString(payload: TenantApiPayload, keys: string[]): string | undefined {
    for (const key of keys) {
      const value = payload[key];
      if (typeof value === "string" && value.trim()) {
        return value.trim();
      }
    }

    return undefined;
  }

  private unwrapPayload(payload: TenantApiResponse): TenantApiPayload {
    const root = payload as TenantApiPayload;
    const wrappedKeys = ["data", "result", "tenant", "payload", "value"];

    for (const key of wrappedKeys) {
      const candidate = root[key];
      if (candidate && typeof candidate === "object" && !Array.isArray(candidate)) {
        return candidate as TenantApiPayload;
      }
    }

    return root;
  }

  private mapToDomain(payload: TenantApiResponse): TenantInfo {
    const currentPayload = this.unwrapPayload(payload);

    const embeddedCompany =
      (currentPayload.primaryCompany as TenantApiPayload | undefined) ??
      (currentPayload.PrimaryCompany as TenantApiPayload | undefined) ??
      (currentPayload.company as TenantApiPayload | undefined) ??
      (currentPayload.Company as TenantApiPayload | undefined);

    const embeddedCompanyName =
      embeddedCompany && typeof embeddedCompany === "object"
        ? this.readString(embeddedCompany, ["name", "Name", "displayName", "DisplayName", "nomeEmpresa", "NomeEmpresa", "nmEmpresa", "NmEmpresa"])
        : undefined;

    return {
      tenantId:
        this.readString(currentPayload, ["tenantId", "TenantId", "id", "Id"]) ??
        apiConfig.getTenantId(),
      displayName: this.readString(currentPayload, ["displayName", "DisplayName"]),
      primaryCompanyName:
        this.readString(currentPayload, [
          "primaryCompanyName",
          "PrimaryCompanyName",
          "companyName",
          "CompanyName",
          "nomeEmpresa",
          "NomeEmpresa",
          "nmEmpresa",
          "NmEmpresa",
          "razaoSocial",
          "RazaoSocial",
        ]) ?? embeddedCompanyName,
    };
  }

  async getCurrent(): Promise<TenantInfo> {
    const tried: string[] = [];

    for (const endpoint of this.endpoints) {
      tried.push(endpoint);
      try {
        const response = await apiClient.get<TenantApiResponse>(endpoint);
        return this.mapToDomain(response ?? {});
      } catch (error) {
        if (error instanceof ApiError && (error.status === 404 || error.status === 403)) {
          continue;
        }

        throw error;
      }
    }

    throw new Error(`Nao foi possivel carregar dados do tenant. Rotas testadas: ${tried.join(", ")}`);
  }
}
