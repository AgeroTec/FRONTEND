/**
 * HTTP Client
 *
 * Cliente HTTP centralizado usando Axios.
 * - Headers automáticos (X-Tenant-Id, Authorization, X-Correlation-Id)
 * - Interceptors para redirecionar ao /login em 401/403/ERR_NETWORK
 * - Logging seguro (string) para o overlay do Next
 * - Tipagem TS correta (AxiosHeaders)
 */

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosHeaders,
  isAxiosError,
} from "axios";
import { API_CONFIG, TENANT_CONFIG } from "./apiConfig";
import { v4 as uuidv4 } from "uuid";

interface PersistedAuthTokens {
  accessToken?: string;
  tokenType?: string;
}

interface PersistedAuthUser {
  id: string;
  name?: string;
  nome?: string;
}

interface PersistedAuthState {
  user?: PersistedAuthUser | null;
  tokens?: PersistedAuthTokens | null;
}

interface PersistedAuthStorage {
  state?: PersistedAuthState;
}

export class HttpClient {
  private client: AxiosInstance;

  constructor() {
    // Base URL (sempre pública no front)
    const envBase =
      typeof process.env.NEXT_PUBLIC_API_BASE_URL === "string" &&
      process.env.NEXT_PUBLIC_API_BASE_URL.trim() !== ""
        ? process.env.NEXT_PUBLIC_API_BASE_URL
        : undefined;

    const baseURL =
      envBase || API_CONFIG.baseURL || "http://localhost:5103/api/v1";

    this.client = axios.create({
      baseURL,
      timeout: API_CONFIG.timeout || 15000,
      headers: API_CONFIG.headers || { Accept: "application/json" },
    });

    this.setupInterceptors();
  }

  /**
   * Configura interceptors para request e response
   */
  private setupInterceptors(): void {
    // Request: injeta headers padrão
    this.client.interceptors.request.use(
      (config) => {
        const headers = new AxiosHeaders(config.headers);

        // Headers obrigatórios
        headers.set("X-Tenant-Id", TENANT_CONFIG.tenantId);
        headers.set("X-Correlation-Id", uuidv4());

        // Recupera dados de autenticação do localStorage
        if (typeof window !== "undefined") {
          const authData = this.getAuthData();

          if (authData?.tokens?.accessToken && !headers.has("Authorization")) {
            const tokenType = authData.tokens.tokenType ?? "Bearer";
            headers.set(
              "Authorization",
              `${tokenType} ${authData.tokens.accessToken}`
            );
          }

          if (authData?.user) {
            headers.set("X-User-Id", authData.user.id);
            headers.set(
              "X-User-Name",
              authData.user.name ?? authData.user.nome ?? ""
            );
          }
        }

        config.headers = headers;
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response: redireciona para /login e faz log seguro
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error?.response?.status ?? null;
        const code = error?.code ?? null;

        const goLogin = () => {
          if (typeof window !== "undefined" && !location.pathname.startsWith("/login")) {
            try { localStorage.removeItem("auth-storage"); } catch {}
            location.href = "/login";
          }
        };

        // Sem conexão / CORS barrado / mixed content etc.
        if (code === "ERR_NETWORK") {
          goLogin();
        }

        // Não autenticado ou proibido → login
        if (status === 401 || status === 403) {
          goLogin();
        }

        // ===== LOG SEGURO (não vira {} no overlay do Next) =====
        const baseURL = error.config?.baseURL || "";
        const urlPath = error.config?.url || "";
        const fullUrl = baseURL + urlPath;
        const method = error.config?.method?.toUpperCase();

        const isBlob =
          typeof Blob !== "undefined" && error?.response?.data instanceof Blob;
        const isArrayBuffer =
          typeof ArrayBuffer !== "undefined" &&
          error?.response?.data instanceof ArrayBuffer;

        const safeData = (() => {
          const data = error?.response?.data;
          if (data == null) return null;
          if (typeof data === "string") return data;
          if (isBlob) return `Blob(${(data as Blob).type}, ${(data as Blob).size} bytes)`;
          if (isArrayBuffer)
            return `ArrayBuffer(${(data as ArrayBuffer).byteLength} bytes)`;
          try {
            return JSON.stringify(data);
          } catch {
            return String(data);
          }
        })();

        const logPayload = isAxiosError(error)
          ? {
              status: error.response?.status ?? null,
              code: error.code ?? null,
              method,
              url: fullUrl || null,
              data: safeData,
            }
          : { message: String(error) };

        console.error("[HTTP Client Error] " + JSON.stringify(logPayload, null, 2));

        return Promise.reject(error);
      }
    );
  }

  /**
   * Recupera dados de autenticação do localStorage (formato Zustand persist)
   */
  private getAuthData(): PersistedAuthState | null {
    try {
      const authStorage = localStorage.getItem("auth-storage");
      if (!authStorage) return null;

      const parsed: PersistedAuthStorage = JSON.parse(authStorage);
      return parsed.state ?? null;
    } catch (error) {
      console.error("Erro ao recuperar dados de autenticação:", String(error));
      return null;
    }
  }

  // ==== Métodos HTTP ====

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  async downloadFile(url: string, filename: string): Promise<void> {
    const response = await this.client.get(url, { responseType: "blob" });

    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }
}

// Singleton instance
export const httpClient = new HttpClient();
