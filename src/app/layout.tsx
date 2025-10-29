// src/app/layout.tsx
'use client';

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/presentation/stores/authStore";
import "./globals.css";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const router = useRouter();
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    if (!checkAuth()) {
      router.push("/login");
    }
  }, [checkAuth, router]);

  return (
    <html lang="pt-BR">
      <body className="antialiased bg-gray-50 text-gray-900">
        {children} {/* apenas renderiza a página */}
      </body>
    </html>
  );
}
