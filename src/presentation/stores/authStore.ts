import { create } from "zustand";
import { persist } from "zustand/middleware";

import { authService } from "@/infrastructure/di/services";
import { AuthUser } from "@/domain/entities/AuthUser";
import { AuthTokens } from "@/domain/valueObjects/AuthTokens";
import { authTokenStorage } from "@/infrastructure/auth/authTokenStorage";

const AUTH_STORAGE_KEY = "auth-storage";
const SESSION_EXPIRED_MESSAGE_KEY = "auth:session-expired-message";
const SESSION_ACTIVITY_KEY = "auth:session-active";
const REFRESH_LEEWAY_SECONDS = 60;
const MIN_REFRESH_DELAY_MS = 5000;
let refreshTimer: ReturnType<typeof setTimeout> | null = null;

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  tokens: AuthTokens | null;
  rememberMe: boolean;
  login: (login: string, senha: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => boolean;
  isTokenExpired: () => boolean;
}

type AuthPersistedState = Pick<AuthState, "user" | "isAuthenticated" | "tokens" | "rememberMe">;

const readPersistedState = (): AuthPersistedState | null => {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as { state?: AuthPersistedState };
    return parsed.state ?? null;
  } catch {
    return null;
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
  const maxAge =
    state.rememberMe && state.tokens?.expiresIn && state.tokens.expiresIn > 0
      ? state.tokens.expiresIn
      : undefined;

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

const markSessionActive = (): void => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_ACTIVITY_KEY, "1");
};

const hasSessionActivityMarker = (): boolean => {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SESSION_ACTIVITY_KEY) === "1";
};

const clearSessionActivityMarker = (): void => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_ACTIVITY_KEY);
};

const clearRefreshTimer = (): void => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
};

const setSessionExpiredMessage = (): void => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_EXPIRED_MESSAGE_KEY, "Sua sessao expirou. Faca login novamente.");
};

const getRefreshDelay = (tokens: AuthTokens | null): number | null => {
  if (!tokens?.expiresIn || !tokens?.issuedAt) return null;

  const issuedAtMs = new Date(tokens.issuedAt).getTime();
  if (!Number.isFinite(issuedAtMs)) return null;

  const expiresAtMs = issuedAtMs + tokens.expiresIn * 1000;
  const refreshAtMs = expiresAtMs - REFRESH_LEEWAY_SECONDS * 1000;
  const delay = refreshAtMs - Date.now();
  return delay > MIN_REFRESH_DELAY_MS ? delay : MIN_REFRESH_DELAY_MS;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      const clearSessionState = () => {
        clearRefreshTimer();
        authTokenStorage.clear();
        clearAuthCookie();
        clearAuthMetadata();
        clearSessionActivityMarker();
        set({ user: null, isAuthenticated: false, tokens: null, rememberMe: true });
      };

      const scheduleRefresh = (tokens: AuthTokens | null) => {
        clearRefreshTimer();
        const delay = getRefreshDelay(tokens);
        if (delay === null) return;

        refreshTimer = setTimeout(async () => {
          const currentState = get();
          const currentRefreshToken = currentState.tokens?.refreshToken;

          if (!currentState.isAuthenticated || !currentRefreshToken) {
            clearRefreshTimer();
            return;
          }

          try {
            const refreshedTokens = await authService.refreshToken.execute(currentRefreshToken);
            const mergedTokens: AuthTokens = {
              ...refreshedTokens,
              refreshToken: refreshedTokens.refreshToken || currentRefreshToken,
            };

            set({
              user: currentState.user,
              isAuthenticated: true,
              tokens: mergedTokens,
            });

            authTokenStorage.set(mergedTokens);
            syncAuthCookie({
              user: currentState.user,
              isAuthenticated: true,
              tokens: mergedTokens,
              rememberMe: currentState.rememberMe,
            });
            scheduleRefresh(mergedTokens);
          } catch {
            setSessionExpiredMessage();
            clearSessionState();
          }
        }, delay);
      };

      return ({
      user: null,
      isAuthenticated: false,
      tokens: null,
      rememberMe: true,

      login: async (login: string, senha: string, rememberMe = true): Promise<void> => {
        try {
          const response = await authService.login.execute({ login, senha });

          set({
            user: response.user,
            isAuthenticated: true,
            tokens: response.tokens,
            rememberMe,
          });

          const currentState = get();
          authTokenStorage.set(currentState.tokens);
          if (rememberMe) {
            clearSessionActivityMarker();
          } else {
            markSessionActive();
          }
          syncAuthCookie({
            user: currentState.user,
            isAuthenticated: currentState.isAuthenticated,
            tokens: currentState.tokens,
            rememberMe: currentState.rememberMe,
          });
          scheduleRefresh(currentState.tokens);
        } catch (error) {
          clearSessionState();

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
          clearSessionState();
        }
      },

      checkAuth: (): boolean => {
        const persistedState = readPersistedState();
        const state = get();

        if (
          persistedState?.tokens?.accessToken &&
          persistedState.tokens.accessToken !== state.tokens?.accessToken
        ) {
          set({
            user: persistedState.user ?? null,
            isAuthenticated: !!persistedState.isAuthenticated,
            tokens: persistedState.tokens ?? null,
            rememberMe: persistedState.rememberMe ?? true,
          });
          authTokenStorage.set(persistedState.tokens ?? null);
          syncAuthCookie({
            user: persistedState.user ?? null,
            isAuthenticated: !!persistedState.isAuthenticated,
            tokens: persistedState.tokens ?? null,
            rememberMe: persistedState.rememberMe ?? true,
          });
          scheduleRefresh(persistedState.tokens ?? null);
        }

        const effectiveState = get();

        if (!effectiveState.isAuthenticated || !effectiveState.tokens?.accessToken) {
          return false;
        }

        if (effectiveState.isTokenExpired()) {
          clearSessionState();
          return false;
        }

        if (!effectiveState.rememberMe) {
          if (!hasSessionActivityMarker()) {
            clearSessionState();
            return false;
          }
          markSessionActive();
        }

        scheduleRefresh(effectiveState.tokens);
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
    });
    },
    {
      name: AUTH_STORAGE_KEY,
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        tokens: state.tokens,
        rememberMe: state.rememberMe,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        clearRefreshTimer();
        authTokenStorage.set(state.tokens);
        syncAuthCookie({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          tokens: state.tokens,
          rememberMe: state.rememberMe,
        });
        if (!state.rememberMe && state.isAuthenticated && hasSessionActivityMarker()) {
          markSessionActive();
        }
        if (state.isAuthenticated) {
          setTimeout(() => {
            void useAuthStore.getState().checkAuth();
          }, 0);
        }
      },
    }
  )
);
