// src/presentation/stores/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { authService } from "@/application/services/AuthService";
import { AuthUser } from "@/domain/entities/AuthUser";
import { AuthTokens } from "@/domain/valueObjects/AuthTokens";

const persistTokenMetadata = (tokens: AuthTokens) => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem("accessToken", tokens.accessToken);
  localStorage.setItem("tokenType", tokens.tokenType);

  if (tokens.expiresIn && tokens.expiresIn > 0) {
    const issuedTime = tokens.issuedAt ? new Date(tokens.issuedAt).getTime() : Date.now();
    const expirationTime = issuedTime + tokens.expiresIn * 1000;
    localStorage.setItem("tokenExpiration", new Date(expirationTime).toISOString());
  } else {
    localStorage.removeItem("tokenExpiration");
  }
};

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  tokens: AuthTokens | null;
  login: (login: string, senha: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      tokens: null,

      login: async (login: string, senha: string) => {
        try {
          const { user, tokens } = await authService.login({ login, senha });

          set({ user, isAuthenticated: true, tokens });
          persistTokenMetadata(tokens);
        } catch (error) {
          if (error instanceof Error) {
            throw error;
          }

          throw new Error("Erro desconhecido ao fazer login");
        }
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("tokenType");
          localStorage.removeItem("tokenExpiration");
        }

        set({ user: null, isAuthenticated: false, tokens: null });
      },

      checkAuth: () => {
        const s = get();
        return s.isAuthenticated && !!s.tokens?.accessToken;
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
