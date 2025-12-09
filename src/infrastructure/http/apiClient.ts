import { useAuthStore } from "@/presentation/stores/authStore";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5103/api/v1";

const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || "f0e25b5a-598d-4bb9-942f-5f6710cb200a";

function generateCorrelationId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

function getDefaultHeaders(): Record<string, string> {
  return {
    accept: "application/json",
    "Content-Type": "application/json",
    "X-Tenant-Id": TENANT_ID,
    "X-Correlation-Id": generateCorrelationId(),
    "Accept-Language": "pt-BR",
  };
}

function buildUrl(endpoint: string): string {
  if (!endpoint.startsWith("/")) endpoint = "/" + endpoint;
  return `${API_BASE_URL}${endpoint}`;
}

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
  skipAuth = false
): Promise<T> {
  const { tokens } = useAuthStore.getState();

  const headers: Record<string, string> = {
    ...getDefaultHeaders(),
    ...(options.headers as Record<string, string>),
  };

  if (!skipAuth && tokens?.accessToken) {
    headers["Authorization"] = `${tokens.tokenType} ${tokens.accessToken}`;
  }

  const url = buildUrl(endpoint);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const msg =
        err?.message ||
        err?.detail ||
        `Erro ${response.status}: ${response.statusText}`;
      throw new Error(msg);
    }

    const data = await response.json().catch(() => ({}));
    return data as T;
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("Erro desconhecido ao acessar API");
  }
}

export const apiClient = {
  get: <T = unknown>(endpoint: string, skipAuth = false): Promise<T> =>
    apiFetch<T>(endpoint, { method: "GET" }, skipAuth),

  post: <T = unknown>(endpoint: string, body: unknown, skipAuth = false): Promise<T> =>
    apiFetch<T>(
      endpoint,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
      skipAuth
    ),

  put: <T = unknown>(endpoint: string, body: unknown, skipAuth = false): Promise<T> =>
    apiFetch<T>(
      endpoint,
      {
        method: "PUT",
        body: JSON.stringify(body),
      },
      skipAuth
    ),

  delete: <T = void>(endpoint: string, skipAuth = false): Promise<T> =>
    apiFetch<T>(endpoint, { method: "DELETE" }, skipAuth),
};
