// src/presentation/stores/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

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
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  tokens: AuthTokens | null;
  login: (login: string, senha: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5103/api/v1";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      tokens: null,

      login: async (login: string, senha: string) => {
        try {
          const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ login, senha }),
          });

          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            const msg = err?.message || err?.detail || "Usuário ou senha inválidos";
            throw new Error(msg);
          }

          const tokens: AuthTokens = await res.json();

          // Tenta buscar dados do usuário real (endpoint opcional /auth/me)
          let user: User | null = null;
          try {
            const meRes = await fetch(`${API_BASE_URL}/auth/me`, {
              headers: {
                Authorization: `${tokens.tokenType} ${tokens.accessToken}`,
              },
            });

            if (meRes.ok) {
              // espera que /auth/me retorne algo como { id, email, name }
              user = await meRes.json();
            } else {
              // fallback simples caso não exista /auth/me
              user = {
                id: "1",
                email: login.includes("@") ? login : `${login}@sistema.com`,
                name: login,
              };
            }
          } catch {
            user = {
              id: "1",
              email: login.includes("@") ? login : `${login}@sistema.com`,
              name: login,
            };
          }

          set({ user, isAuthenticated: true, tokens });
        } catch (error) {
          if (error instanceof Error) throw new Error(error.message);
          throw new Error("Erro desconhecido ao fazer login");
        }
      },

      logout: () => {
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
