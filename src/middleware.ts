import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_STORAGE_KEY = "auth-storage";
const publicRoutes = ["/login", "/api/public"];

function parsePersistedAuth(rawValue: string | undefined) {
  if (!rawValue) return null;

  try {
    const parsed = JSON.parse(decodeURIComponent(rawValue));
    return parsed?.state ?? null;
  } catch {
    return null;
  }
}

function hasValidSession(state: unknown): boolean {
  if (!state || typeof state !== "object") return false;

  const session = state as {
    isAuthenticated?: boolean;
    tokens?: { accessToken?: string; expiresIn?: number; issuedAt?: string };
  };

  if (!session.isAuthenticated || !session.tokens?.accessToken) return false;

  if (session.tokens.expiresIn && session.tokens.issuedAt) {
    const issuedAtMs = new Date(session.tokens.issuedAt).getTime();
    if (Number.isFinite(issuedAtMs)) {
      const expiresAtMs = issuedAtMs + session.tokens.expiresIn * 1000;
      if (Date.now() >= expiresAtMs) return false;
    }
  }

  return true;
}

function sanitizeReturnTo(returnTo: string | null): string {
  if (!returnTo || !returnTo.startsWith("/") || returnTo.startsWith("//")) {
    return "/home";
  }

  if (returnTo.startsWith("/login")) return "/home";
  return returnTo;
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const persistedState = parsePersistedAuth(req.cookies.get(AUTH_STORAGE_KEY)?.value);
  const isAuthenticated = hasValidSession(persistedState);

  if (pathname.startsWith("/login")) {
    if (isAuthenticated) {
      const requestedReturnTo = sanitizeReturnTo(req.nextUrl.searchParams.get("returnTo"));
      return NextResponse.redirect(new URL(requestedReturnTo, req.url));
    }
    return NextResponse.next();
  }

  if (publicRoutes.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("returnTo", `${pathname}${search ?? ""}`);

    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(AUTH_STORAGE_KEY);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico|api).*)"],
};
