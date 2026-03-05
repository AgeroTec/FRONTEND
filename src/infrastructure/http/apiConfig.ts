const DEFAULT_API_BASE_URL = "http://localhost:5103/api/v1";
const DEFAULT_TENANT_ID = "f0e25b5a-598d-4bb9-942f-5f6710cb200a";

const isProduction = () => process.env.NODE_ENV === "production";

export const apiConfig = {
  getBaseUrl(): string {
    const envUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
    if (envUrl) return envUrl;

    if (!isProduction()) return DEFAULT_API_BASE_URL;
    throw new Error("NEXT_PUBLIC_API_URL deve ser definido em produção.");
  },

  getTenantId(): string {
    const envTenant = process.env.NEXT_PUBLIC_TENANT_ID?.trim();
    if (envTenant) return envTenant;

    if (!isProduction()) return DEFAULT_TENANT_ID;
    throw new Error("NEXT_PUBLIC_TENANT_ID deve ser definido em produção.");
  },

  getLocale(): string {
    return process.env.NEXT_PUBLIC_LOCALE?.trim() || "pt-BR";
  },
};
