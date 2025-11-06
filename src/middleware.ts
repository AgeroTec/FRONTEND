// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define as rotas públicas (que não exigem login)
const publicRoutes = ["/login", "/api/public"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Se for uma rota pública, deixa passar
  if (publicRoutes.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  // Busca o token no localStorage persistido pelo Zustand (via cookie local)
  const storedData = req.cookies.get("auth-storage")?.value;

  let isAuthenticated = false;
  try {
    if (storedData) {
      const auth = JSON.parse(decodeURIComponent(storedData));
      isAuthenticated = !!auth?.state?.tokens?.accessToken;
    }
  } catch {
    isAuthenticated = false;
  }

  // Se não autenticado, redireciona para /login
  if (!isAuthenticated) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|static|favicon.ico|api/public).*)", // aplica em tudo, exceto recursos públicos
  ],
};
