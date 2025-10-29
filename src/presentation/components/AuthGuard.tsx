"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/presentation/stores/authStore";

interface Props {
  children: React.ReactNode;
}

export function AuthGuard({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    const isAuth = checkAuth();
    if (!isAuth && pathname !== "/login") {
      router.replace("/login");
    }
    if (isAuth && pathname === "/login") {
      router.replace("/credores");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, pathname]);

  // Evita piscar conteúdo protegido
  if (!isAuthenticated && pathname !== "/login") {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-gray-500">Verificando autenticação...</span>
      </div>
    );
  }

  return <>{children}</>;
}
