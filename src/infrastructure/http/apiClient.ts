// src/infrastructure/http/apiClient.ts
import { useAuthStore } from "@/presentation/stores/authStore";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5103/api/v1";

const defaultHeaders = {
  accept: "application/json",
  "Content-Type": "application/json",
  "X-Tenant-Id": "f0e25b5a-598d-4bb9-942f-5f6710cb200a",
  "X-Correlation-Id": "f1e2d3c4-b5a6-7890-1234-567890abcdef",
  "Idempotency-Key": "9a8b7c6d-5e4f-3210-9876-543210fedcba",
  "Accept-Language": "pt-BR",
};

function buildUrl(endpoint: string) {
  if (!endpoint.startsWith("/")) endpoint = "/" + endpoint;
  return `${API_BASE_URL}${endpoint}`;
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {},
  skipAuth = false
): Promise<T> {
  const { tokens } = useAuthStore.getState();

  const headers: Record<string, string> = {
    ...defaultHeaders,
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
