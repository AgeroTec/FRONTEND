import { AuthTokens } from "@/domain/valueObjects/AuthTokens";
import { authTokenStorage } from "@/infrastructure/auth/authTokenStorage";
import { apiConfig } from "@/infrastructure/http/apiConfig";
import { ApiError } from "@/infrastructure/http/apiErrors";

const AUTH_STORAGE_KEY = "auth-storage";
const SESSION_EXPIRED_MESSAGE_KEY = "auth:session-expired-message";

interface ApiFetchInternalOptions {
  disableAuthRetry?: boolean;
}

interface RefreshApiResponse {
  accessToken: string;
  tokenType: string;
  expiresIn?: number;
  issuedAt?: string;
  refreshToken?: string;
}

let refreshPromise: Promise<boolean> | null = null;

function generateCorrelationId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

function generateIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 14)}`;
}

function getDefaultHeaders(): Record<string, string> {
  return {
    accept: "application/json",
    "X-Tenant-Id": apiConfig.getTenantId(),
    "X-Correlation-Id": generateCorrelationId(),
    "Accept-Language": apiConfig.getLocale(),
  };
}

function normalizeHeaders(headers?: HeadersInit): Record<string, string> {
  if (!headers) return {};

  if (headers instanceof Headers) {
    const result: Record<string, string> = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  if (Array.isArray(headers)) {
    return headers.reduce<Record<string, string>>((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
  }

  return { ...headers };
}

function hasContentType(headers: Record<string, string>): boolean {
  return Object.keys(headers).some((key) => key.toLowerCase() === "content-type");
}

function shouldSetJsonContentType(body: unknown, headers: Record<string, string>): boolean {
  if (body === undefined || body === null) return false;
  if (hasContentType(headers)) return false;
  if (typeof FormData !== "undefined" && body instanceof FormData) return false;
  return true;
}

function buildUrl(endpoint: string): string {
  const normalized = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${apiConfig.getBaseUrl()}${normalized}`;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204 || response.status === 205) return undefined;

  const contentType = response.headers.get("content-type") || "";
  const text = await response.text();

  if (!text) return undefined;
  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  return text;
}

function extractErrorMessage(payload: unknown, response: Response): string {
  if (typeof payload === "string" && payload.trim()) return payload;

  if (payload && typeof payload === "object") {
    const maybeMessage = (payload as { message?: string; detail?: string }).message;
    const maybeDetail = (payload as { detail?: string }).detail;
    const maybeTitle = (payload as { title?: string }).title;
    const maybeErrors = (payload as { errors?: Record<string, string[] | string> }).errors;

    if (maybeTitle && maybeDetail) return `${maybeTitle}: ${maybeDetail}`;
    if (maybeMessage) return maybeMessage;
    if (maybeDetail) return maybeDetail;
    if (maybeTitle) return maybeTitle;

    if (maybeErrors && typeof maybeErrors === "object") {
      const firstErrorGroup = Object.values(maybeErrors)[0];
      if (Array.isArray(firstErrorGroup) && firstErrorGroup.length > 0) {
        return firstErrorGroup[0];
      }

      if (typeof firstErrorGroup === "string" && firstErrorGroup.trim()) {
        return firstErrorGroup;
      }
    }
  }

  switch (response.status) {
    case 401:
      return "Sua sessao expirou. Faca login novamente.";
    case 403:
      return "Voce nao tem permissao para executar esta acao.";
    case 409:
      return "Conflito de dados. Atualize a tela e tente novamente.";
    case 422:
      return "Dados invalidos. Revise os campos informados.";
    case 500:
      return "Erro interno do servidor. Tente novamente em instantes.";
    default:
      return `Erro ${response.status}: ${response.statusText}`;
  }
}

function isAuthEndpoint(endpoint: string): boolean {
  const normalized = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return normalized.startsWith("/auth/");
}

function syncPersistedAuthTokens(tokens: AuthTokens): void {
  if (typeof window === "undefined") return;

  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  let nextState: {
    state: { user: unknown; isAuthenticated: boolean; tokens: AuthTokens; rememberMe: boolean };
    version: number;
  };

  if (raw) {
    try {
      const parsed = JSON.parse(raw) as {
        state?: { user?: unknown; isAuthenticated?: boolean; tokens?: AuthTokens; rememberMe?: boolean };
        version?: number;
      };

      nextState = {
        state: {
          user: parsed.state?.user ?? null,
          isAuthenticated: true,
          tokens,
          rememberMe: parsed.state?.rememberMe ?? true,
        },
        version: parsed.version ?? 0,
      };
    } catch {
      nextState = {
        state: { user: null, isAuthenticated: true, tokens, rememberMe: true },
        version: 0,
      };
    }
  } else {
    nextState = {
      state: { user: null, isAuthenticated: true, tokens, rememberMe: true },
      version: 0,
    };
  }

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextState));

  const encodedPayload = encodeURIComponent(JSON.stringify(nextState));
  const maxAge =
    nextState.state.rememberMe && tokens.expiresIn && tokens.expiresIn > 0 ? tokens.expiresIn : undefined;
  document.cookie = `${AUTH_STORAGE_KEY}=${encodedPayload}; path=/; SameSite=Lax${maxAge ? `; Max-Age=${maxAge}` : ""}`;
}

function clearPersistedAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
  document.cookie = `${AUTH_STORAGE_KEY}=; path=/; Max-Age=0; SameSite=Lax`;
}

function redirectToLoginWithSessionExpiredMessage(): void {
  if (typeof window === "undefined") return;

  const currentPath = `${window.location.pathname}${window.location.search}`;
  const returnTo = currentPath && currentPath !== "/login" ? currentPath : "/home";

  sessionStorage.setItem(
    SESSION_EXPIRED_MESSAGE_KEY,
    "Sua sessao expirou. Faca login novamente."
  );

  if (window.location.pathname.startsWith("/login")) return;

  const loginUrl = `/login?returnTo=${encodeURIComponent(returnTo)}`;
  window.location.replace(loginUrl);
}

async function refreshSessionToken(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const currentRefreshToken = authTokenStorage.getRefreshToken();
  if (!currentRefreshToken) return false;

  try {
    const response = await apiFetch<RefreshApiResponse>(
      "/auth/refresh",
      {
        method: "POST",
        body: JSON.stringify({ refreshToken: currentRefreshToken }),
      },
      true,
      { disableAuthRetry: true }
    );

    if (!response.accessToken) {
      authTokenStorage.clear();
      clearPersistedAuth();
      return false;
    }

    const newTokens: AuthTokens = {
      accessToken: response.accessToken,
      tokenType: response.tokenType,
      expiresIn: response.expiresIn,
      issuedAt: response.issuedAt || new Date().toISOString(),
      refreshToken: response.refreshToken || currentRefreshToken,
    };

    authTokenStorage.set(newTokens);
    syncPersistedAuthTokens(newTokens);
    return true;
  } catch {
    authTokenStorage.clear();
    clearPersistedAuth();
    return false;
  }
}

async function ensureRefreshedToken(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = refreshSessionToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
  skipAuth = false,
  internalOptions: ApiFetchInternalOptions = {}
): Promise<T> {
  const defaultHeaders = getDefaultHeaders();
  const mergedHeaders = {
    ...defaultHeaders,
    ...normalizeHeaders(options.headers),
  };

  if (shouldSetJsonContentType(options.body, mergedHeaders)) {
    mergedHeaders["Content-Type"] = "application/json";
  }

  const method = (options.method || "GET").toUpperCase();
  const isMutation = method === "POST" || method === "PUT" || method === "PATCH" || method === "DELETE";
  if (isMutation && !("Idempotency-Key" in mergedHeaders)) {
    mergedHeaders["Idempotency-Key"] = generateIdempotencyKey();
  }

  if (!skipAuth) {
    const authHeader = authTokenStorage.getAuthHeader();
    if (authHeader) {
      mergedHeaders.Authorization = authHeader;
    }
  }

  const response = await fetch(buildUrl(endpoint), {
    ...options,
    headers: mergedHeaders,
  });

  const payload = await parseResponseBody(response);

  if (!response.ok) {
    const shouldRetryWithRefresh =
      response.status === 401 &&
      !skipAuth &&
      !internalOptions.disableAuthRetry &&
      !isAuthEndpoint(endpoint);

    if (shouldRetryWithRefresh) {
      const refreshed = await ensureRefreshedToken();
      if (refreshed) {
        return apiFetch<T>(endpoint, options, skipAuth, { disableAuthRetry: true });
      }
      redirectToLoginWithSessionExpiredMessage();
    }

    const message = extractErrorMessage(payload, response);
    throw new ApiError(message, response.status, payload);
  }

  if (payload === undefined) return undefined as T;
  return payload as T;
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

  patch: <T = unknown>(endpoint: string, body: unknown, skipAuth = false): Promise<T> =>
    apiFetch<T>(
      endpoint,
      {
        method: "PATCH",
        body: JSON.stringify(body),
      },
      skipAuth
    ),
};
