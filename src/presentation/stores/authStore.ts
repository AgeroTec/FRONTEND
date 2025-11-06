// src/presentation/stores/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiFetch } from "@/infrastructure/http/apiClient";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthTokens {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
  refreshToken: string | null;
  idToken: string | null;
  scope: string;
  issuedAt: string;
  [key: string]: any;
}

interface AuthState {
  user: User | null;
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
          // Faz login
          const tokens = await apiFetch<AuthTokens>(
            "/auth/login",
            {
              method: "POST",
              body: JSON.stringify({ login, senha }),
            },
            true
          );

          if (!tokens?.accessToken)
            throw new Error("A resposta não contém accessToken.");

          // Busca o usuário (se existir o endpoint /auth/me)
          let user: User | null = null;
          try {
            user = await apiFetch<User>("/auth/me");
          } catch {
            user = {
              id: "1",
              email: login,
              name: login.split("@")[0],
            };
          }

          set({
            user,
            tokens,
            isAuthenticated: true,
          });
        } catch (err) {
          if (err instanceof Error) throw new Error(err.message);
          throw new Error("Erro ao autenticar usuário.");
        }
      },

      logout: () => {
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
        });
        localStorage.removeItem("auth-storage");
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
