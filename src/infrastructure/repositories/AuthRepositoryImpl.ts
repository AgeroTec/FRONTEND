import { IAuthRepository, AuthResponse } from "@/domain/repositories/IAuthRepository";
import { AuthUser } from "@/domain/entities/AuthUser";
import { AuthTokens } from "@/domain/valueObjects/AuthTokens";
import { LoginCredentials } from "@/domain/valueObjects/LoginCredentials";
import {
  AuthenticationError,
  InvalidCredentialsError,
  UnauthorizedError,
} from "@/domain/exceptions/AuthenticationError";
import { ApiError } from "@/infrastructure/http/apiErrors";
import { apiFetch } from "../http/apiClient";

interface LoginApiResponse {
  accessToken: string;
  tokenType: string;
  expiresIn?: number;
  issuedAt?: string;
  refreshToken?: string;
  user?: {
    id: string;
    login: string;
    nome: string;
    email?: string;
    perfil?: string;
  };
}

export class AuthRepositoryImpl implements IAuthRepository {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiFetch<LoginApiResponse>(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify(credentials.toJSON()),
        },
        true
      );

      if (!response.accessToken) {
        throw new AuthenticationError("Resposta da API não contém token de acesso");
      }

      const tokens: AuthTokens = {
        accessToken: response.accessToken,
        tokenType: response.tokenType,
        expiresIn: response.expiresIn,
        issuedAt: response.issuedAt || new Date().toISOString(),
        refreshToken: response.refreshToken,
      };

      const user: AuthUser = response.user || {
        id: "unknown",
        login: credentials.login,
        nome: credentials.login,
      };

      return { user, tokens };
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }

      if (error instanceof ApiError) {
        if (error.status === 401) throw new InvalidCredentialsError();
        if (error.status === 403) throw new UnauthorizedError();
        throw new AuthenticationError(`Falha na autenticação: ${error.message}`);
      }

      if (error instanceof Error) {
        throw new AuthenticationError(`Falha na autenticação: ${error.message}`);
      }

      throw new AuthenticationError("Erro desconhecido ao realizar login");
    }
  }

  async logout(): Promise<void> {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Erro ao realizar logout no servidor:", error);
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const response = await apiFetch<LoginApiResponse>(
        "/auth/refresh",
        {
          method: "POST",
          body: JSON.stringify({ refreshToken }),
        },
        true
      );

      if (!response.accessToken) {
        throw new AuthenticationError("Resposta da API não contém token de acesso");
      }

      return {
        accessToken: response.accessToken,
        tokenType: response.tokenType,
        expiresIn: response.expiresIn,
        issuedAt: response.issuedAt || new Date().toISOString(),
        refreshToken: response.refreshToken,
      };
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new AuthenticationError(`Falha ao renovar token: ${error.message}`);
      }

      throw new AuthenticationError("Erro desconhecido ao renovar token");
    }
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      if (!token || token.trim() === "") {
        return false;
      }

      const parts = token.split(".");
      if (parts.length !== 3) {
        return false;
      }

      const payload = this.decodeJwtPayload(parts[1]);
      const exp = payload?.exp;

      if (typeof exp !== "number") {
        return false;
      }

      return Date.now() < exp * 1000;
    } catch {
      return false;
    }
  }

  private decodeJwtPayload(payloadBase64Url: string): { exp?: number } | null {
    const base64 = payloadBase64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padLength = (4 - (base64.length % 4)) % 4;
    const padded = base64 + "=".repeat(padLength);
    if (typeof atob !== "function") {
      return null;
    }

    const json = atob(padded);

    const parsed = JSON.parse(json);
    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    return parsed as { exp?: number };
  }
}
