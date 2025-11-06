import { create } from "zustand";
import { persist } from "zustand/middleware";

import { authService } from "@/application/services/AuthService";
import { AuthUser } from "@/domain/entities/AuthUser";
import { AuthTokens } from "@/domain/valueObjects/AuthTokens";

const persistTokenMetadata = (tokens: AuthTokens): void => {
  if (typeof window === "undefined") return;

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

const clearTokenMetadata = (): void => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("accessToken");
  localStorage.removeItem("tokenType");
  localStorage.removeItem("tokenExpiration");
  localStorage.removeItem("auth-storage");
};

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  tokens: AuthTokens | null;
  login: (login: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => boolean;
  isTokenExpired: () => boolean;
}

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

          persistTokenMetadata(response.tokens);
        } catch (error) {
          set({ user: null, isAuthenticated: false, tokens: null });
          clearTokenMetadata();

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
          clearTokenMetadata();
          set({ user: null, isAuthenticated: false, tokens: null });
        }
      },

      checkAuth: (): boolean => {
        const state = get();

        if (!state.isAuthenticated || !state.tokens?.accessToken) {
          return false;
        }

        if (state.isTokenExpired()) {
          clearTokenMetadata();
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
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        tokens: state.tokens,
      }),
    }
  )
);
