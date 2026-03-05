import { AuthTokens } from "@/domain/valueObjects/AuthTokens";

const ACCESS_TOKEN_KEY = "accessToken";
const TOKEN_TYPE_KEY = "tokenType";
const TOKEN_EXPIRATION_KEY = "tokenExpiration";
const REFRESH_TOKEN_KEY = "refreshToken";
const TOKEN_ISSUED_AT_KEY = "tokenIssuedAt";

export const authTokenStorage = {
  set(tokens: AuthTokens | null): void {
    if (typeof window === "undefined") return;

    if (!tokens) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(TOKEN_TYPE_KEY);
      localStorage.removeItem(TOKEN_EXPIRATION_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(TOKEN_ISSUED_AT_KEY);
      return;
    }

    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(TOKEN_TYPE_KEY, tokens.tokenType);
    if (tokens.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }

    if (tokens.issuedAt) {
      localStorage.setItem(TOKEN_ISSUED_AT_KEY, tokens.issuedAt);
    } else {
      localStorage.removeItem(TOKEN_ISSUED_AT_KEY);
    }

    if (tokens.expiresIn && tokens.expiresIn > 0) {
      const issuedTime = tokens.issuedAt ? new Date(tokens.issuedAt).getTime() : Date.now();
      const expirationTime = issuedTime + tokens.expiresIn * 1000;
      localStorage.setItem(TOKEN_EXPIRATION_KEY, new Date(expirationTime).toISOString());
    } else {
      localStorage.removeItem(TOKEN_EXPIRATION_KEY);
    }
  },

  clear(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(TOKEN_TYPE_KEY);
    localStorage.removeItem(TOKEN_EXPIRATION_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_ISSUED_AT_KEY);
  },

  getAuthHeader(): string | null {
    if (typeof window === "undefined") return null;

    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!accessToken) return null;

    const tokenType = localStorage.getItem(TOKEN_TYPE_KEY) || "Bearer";
    return `${tokenType} ${accessToken}`;
  },

  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
};
