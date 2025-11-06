import { v4 as uuidv4 } from "uuid";
import { isAxiosError } from "axios";

import { httpClient } from "@/infrastructure/http/httpClient";
import { AuthUser } from "@/domain/entities/AuthUser";
import { AuthTokens } from "@/domain/valueObjects/AuthTokens";
import {
  IAuthRepository,
  LoginCredentials,
  LoginResult,
} from "@/domain/repositories/IAuthRepository";

interface TokenPayload {
  accessToken?: string;
  access_token?: string;
  tokenType?: string;
  token_type?: string;
  expiresIn?: number | string;
  expires_in?: number | string;
  refreshToken?: string | null;
  refresh_token?: string | null;
  idToken?: string | null;
  id_token?: string | null;
  scope?: string | null;
  scopes?: string | null;
  issuedAt?: string;
  issued_at?: string;
}

interface ApiUser {
  id?: string | number;
  codigo?: string | number;
  email?: string;
  login?: string;
  username?: string;
  nome?: string;
  name?: string;
}

interface LoginApiResponse extends TokenPayload {
  data?: {
    token?: TokenPayload;
    usuario?: ApiUser;
    user?: ApiUser;
  };
  token?: TokenPayload;
  usuario?: ApiUser;
  user?: ApiUser;
  message?: string;
  detail?: string;
  errors?: Array<string | { message?: string }>;
  success?: boolean;
}

const DEV_AUTH_TOKEN = process.env.NEXT_PUBLIC_API_AUTH_TOKEN;

const normalizeTokenType = (tokenType?: string): string => {
  if (!tokenType) return "Bearer";
  const trimmed = tokenType.trim();
  if (!trimmed) return "Bearer";
  return trimmed.toLowerCase() === "bearer" ? "Bearer" : trimmed;
};

const extractTokenPayload = (payload: LoginApiResponse): TokenPayload | undefined => {
  if (payload.data?.token) return payload.data.token;
  if (payload.token) return payload.token;

  const directPayload: TokenPayload = {
    accessToken: payload.accessToken ?? payload.access_token,
    tokenType: payload.tokenType ?? payload.token_type,
    expiresIn: payload.expiresIn ?? payload.expires_in,
    refreshToken: payload.refreshToken ?? payload.refresh_token,
    idToken: payload.idToken ?? payload.id_token,
    scope: payload.scope ?? payload.scopes,
    issuedAt: payload.issuedAt ?? payload.issued_at,
  };

  const hasDirectData = Object.values(directPayload).some(
    (value) => value !== undefined && value !== null
  );
  return hasDirectData ? directPayload : undefined;
};

const parseTokens = (payload: LoginApiResponse): AuthTokens => {
  const rawToken = extractTokenPayload(payload);

  const accessToken =
    rawToken?.accessToken ??
    rawToken?.access_token ??
    payload.accessToken ??
    payload.access_token;

  if (!accessToken) {
    throw new Error("A resposta do servidor não retornou o token de acesso.");
  }

  const rawTokenType =
    rawToken?.tokenType ?? rawToken?.token_type ?? payload.tokenType ?? payload.token_type;
  const tokenType = normalizeTokenType(rawTokenType);

  const rawExpires =
    rawToken?.expiresIn ?? rawToken?.expires_in ?? payload.expiresIn ?? payload.expires_in;
  const parsedExpires = typeof rawExpires === "string" ? parseInt(rawExpires, 10) : rawExpires;
  const expiresIn =
    typeof parsedExpires === "number" && Number.isFinite(parsedExpires) ? parsedExpires : 0;

  const refreshToken =
    rawToken?.refreshToken ??
    rawToken?.refresh_token ??
    payload.refreshToken ??
    payload.refresh_token ??
    null;

  const idToken =
    rawToken?.idToken ?? rawToken?.id_token ?? payload.idToken ?? payload.id_token ?? null;

  const rawScope = rawToken?.scope ?? rawToken?.scopes ?? payload.scope ?? payload.scopes;
  const scope = typeof rawScope === "string" ? rawScope : "";

  const issuedAt =
    rawToken?.issuedAt ??
    rawToken?.issued_at ??
    payload.issuedAt ??
    payload.issued_at ??
    new Date().toISOString();

  return {
    accessToken,
    tokenType,
    expiresIn,
    refreshToken,
    idToken,
    scope,
    issuedAt,
  };
};

const extractUserPayload = (payload: LoginApiResponse): ApiUser | undefined => {
  if (payload.data?.usuario) return payload.data.usuario;
  if (payload.data?.user) return payload.data.user;
  if (payload.usuario) return payload.usuario;
  if (payload.user) return payload.user;
  return undefined;
};

const parseUser = (payload: LoginApiResponse, login: string): AuthUser => {
  const rawUser = extractUserPayload(payload);

  const fallbackEmail = login.includes("@") ? login : `${login}@sistema.com`;
  const fallbackName = login || "Usuário";

  if (!rawUser) {
    return {
      id: login || "1",
      email: fallbackEmail,
      name: fallbackName,
    };
  }

  // Evita TS5076: adicione parênteses quando misturar ?? e ||
  const id = (rawUser.id ?? rawUser.codigo ?? login) || "1";
  const emailCandidate = rawUser.email ?? rawUser.login ?? rawUser.username;
  const nameCandidate = rawUser.nome ?? rawUser.name ?? rawUser.login ?? fallbackName;

  return {
    id: String(id),
    email: emailCandidate
      ? emailCandidate.includes("@")
        ? emailCandidate
        : `${emailCandidate}@sistema.com`
      : fallbackEmail,
    name: nameCandidate,
  };
};

const mergeUserData = (base: AuthUser, update: ApiUser & Partial<AuthUser>): AuthUser => {
  return {
    id: update.id ? String(update.id) : base.id,
    email: update.email ?? base.email,
    name: update.nome ?? update.name ?? base.name,
  };
};

const buildLoginHeaders = () => {
  const headers: Record<string, string> = {
    "Idempotency-Key": uuidv4(),
  };

  if (DEV_AUTH_TOKEN) {
    headers["Authorization"] = DEV_AUTH_TOKEN.startsWith("Bearer ")
      ? DEV_AUTH_TOKEN
      : `Bearer ${DEV_AUTH_TOKEN}`;
  }

  return headers;
};

const extractErrorMessage = (data: unknown): string | undefined => {
  if (!data) return undefined;

  if (typeof data === "string") return data;

  if (typeof data === "object") {
    const record = data as Record<string, unknown>;
    if (typeof record.message === "string" && record.message.trim()) return record.message;
    if (typeof record.detail === "string" && record.detail.trim()) return record.detail;

    if (Array.isArray(record.errors) && record.errors.length > 0) {
      const firstError = record.errors[0];
      if (typeof firstError === "string") return firstError;
      if (typeof firstError === "object" && firstError && "message" in firstError) {
        const message = (firstError as { message?: string }).message;
        if (message) return message;
      }
    }
  }

  return undefined;
};

export class AuthRepositoryImpl implements IAuthRepository {
  async login(credentials: LoginCredentials): Promise<LoginResult> {
    try {
      const payload = await httpClient.post<LoginApiResponse>(
        "/auth/login",
        credentials,
        {
          headers: buildLoginHeaders(),
        }
      );

      const tokens = parseTokens(payload);
      let user = parseUser(payload, credentials.login);

      const hasUserFromLogin = Boolean(extractUserPayload(payload));

      if (!hasUserFromLogin) {
        try {
          const meResponse = await httpClient.get<ApiUser & Partial<AuthUser>>("/auth/me", {
            headers: {
              Authorization: `${tokens.tokenType} ${tokens.accessToken}`,
            },
          });

          if (meResponse && typeof meResponse === "object") {
            user = mergeUserData(user, meResponse);
          }
        } catch {
          // Ignora erros ao tentar buscar o perfil
        }
      }

      return { user, tokens };
    } catch (error) {
      if (isAxiosError(error)) {
        const status = error.response?.status ?? 0;
        const message =
          extractErrorMessage(error.response?.data) ||
          (status === 401
            ? "Credenciais inválidas."
            : `Não foi possível autenticar (HTTP ${status}).`);
        throw new Error(message);
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Erro desconhecido ao fazer login");
    }
  }
}

export const authRepository = new AuthRepositoryImpl();
