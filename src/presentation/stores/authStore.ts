import { create } from "zustand";
import { persist } from "zustand/middleware";

import { authService } from "@/application/services/AuthService";
import { AuthUser } from "@/domain/entities/AuthUser";
import { AuthTokens } from "@/domain/valueObjects/AuthTokens";

const AUTH_STORAGE_KEY = "auth-storage";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  tokens: AuthTokens | null;
  login: (login: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => boolean;
  isTokenExpired: () => boolean;
}

type AuthPersistedState = Pick<AuthState, "user" | "isAuthenticated" | "tokens">;

const setTokenMetadata = (tokens: AuthTokens | null): void => {
  if (typeof window === "undefined") return;

  if (!tokens) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("tokenType");
    localStorage.removeItem("tokenExpiration");
    return;
  }

  localStorage.setItem("accessToken", tokens.accessToken);
  localStorage.setItem("tokenType", tokens.tokenType);

  if (tokens.expiresIn && tokens.expiresIn > 0) {
    const issuedTime = tokens.issuedAt
      ? new Date(tokens.issuedAt).getTime()
      : Date.now();
    const expirationTime = issuedTime + tokens.expiresIn * 1000;
    localStorage.setItem("tokenExpiration", new Date(expirationTime).toISOString());
  } else {
    localStorage.removeItem("tokenExpiration");
  }
};

const syncAuthCookie = (state: AuthPersistedState): void => {
  if (typeof document === "undefined") return;

  const payload = {
    state: {
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      tokens: state.tokens,
    },
    version: 0,
  };

  const encodedPayload = encodeURIComponent(JSON.stringify(payload));
  const maxAge = state.tokens?.expiresIn && state.tokens.expiresIn > 0 ? state.tokens.expiresIn : undefined;

  document.cookie = `${AUTH_STORAGE_KEY}=${encodedPayload}; path=/; SameSite=Lax${
    maxAge ? `; Max-Age=${maxAge}` : ""
  }`;
};

const clearAuthCookie = (): void => {
  if (typeof document === "undefined") return;

  document.cookie = `${AUTH_STORAGE_KEY}=; path=/; Max-Age=0; SameSite=Lax`;
};

const clearAuthMetadata = (): void => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      tokens: null,

      login: async (login: string, senha: string): Promise<void> => {
        try {
          const response = await authService.login.execute({ login, senha });

          set({
            user: response.user,
            isAuthenticated: true,
            tokens: response.tokens
          });

          const currentState = get();
          setTokenMetadata(currentState.tokens);
          syncAuthCookie({
            user: currentState.user,
            isAuthenticated: currentState.isAuthenticated,
            tokens: currentState.tokens,
          });
        } catch (error) {
          set({ user: null, isAuthenticated: false, tokens: null });
          setTokenMetadata(null);
          clearAuthCookie();
          clearAuthMetadata();

          if (error instanceof Error) {
            throw error;
          }

          throw new Error("Erro desconhecido ao fazer login");
        }
      },

      logout: async (): Promise<void> => {
        try {
          await authService.logout.execute();
        } catch (error) {
          console.error("Erro ao realizar logout:", error);
        } finally {
          setTokenMetadata(null);
          clearAuthCookie();
          clearAuthMetadata();
          set({ user: null, isAuthenticated: false, tokens: null });
        }
      },

      checkAuth: (): boolean => {
        const state = get();

        if (!state.isAuthenticated || !state.tokens?.accessToken) {
          return false;
        }

        if (state.isTokenExpired()) {
          setTokenMetadata(null);
          clearAuthCookie();
          clearAuthMetadata();
          set({ user: null, isAuthenticated: false, tokens: null });
          return false;
        }

        return true;
      },

      isTokenExpired: (): boolean => {
        const state = get();
        const tokens = state.tokens;

        if (!tokens?.expiresIn || !tokens?.issuedAt) {
          return false;
        }

        const issuedTime = new Date(tokens.issuedAt).getTime();
        const expirationTime = issuedTime + tokens.expiresIn * 1000;
        return Date.now() >= expirationTime;
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        tokens: state.tokens,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        setTokenMetadata(state.tokens);
        syncAuthCookie({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          tokens: state.tokens,
        });
      },
    }
  )
);
