"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/presentation/stores/authStore";
import { LoginForm } from "@/presentation/components/LoginForm";

const SESSION_EXPIRED_MESSAGE_KEY = "auth:session-expired-message";

export default function LoginPage() {
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginStore = useAuthStore((s) => s.login);
  const checkAuth = useAuthStore((s) => s.checkAuth);

  const returnTo = useMemo(() => {
    const requested = searchParams.get("returnTo");
    if (!requested || !requested.startsWith("/") || requested.startsWith("//")) return "/home";
    if (requested.startsWith("/login")) return "/home";
    return requested;
  }, [searchParams]);

  useEffect(() => {
    if (checkAuth()) {
      router.replace(returnTo);
    }
  }, [checkAuth, returnTo, router]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const expiredMessage = sessionStorage.getItem(SESSION_EXPIRED_MESSAGE_KEY);
    if (expiredMessage) {
      setErro(expiredMessage);
      sessionStorage.removeItem(SESSION_EXPIRED_MESSAGE_KEY);
    }
  }, []);

  const handleSubmit = async (usuario: string, senha: string, rememberMe: boolean) => {
    setLoading(true);
    setErro("");

    try {
      await loginStore(usuario, senha, rememberMe);
      router.replace(returnTo);
    } catch (err) {
      if (err instanceof Error) {
        setErro(err.message);
      } else {
        setErro("Erro desconhecido ao autenticar.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Lado esquerdo */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-blue-900 to-blue-700">
        <div className="absolute inset-0 flex flex-col items-center justify-between p-12 text-white">
          <div className="text-5xl font-bold mt-8">UNIO</div>

          <div className="max-w-md text-center">
            <div className="text-sm font-medium text-blue-200 mb-2">
              PLATAFORMA - DESENVOLVIMENTO
            </div>
            <h2 className="text-4xl font-bold mb-4">
              Parceria de crescimento e desenvolvimento.
            </h2>
            <p className="text-blue-100 text-lg">Tela para desenvolvimento.</p>
          </div>

          <div className="text-sm text-blue-300">
            Propriedade de Agero Tecnologia Ltda.
          </div>
        </div>
      </div>

      {/* Lado direito - Formulário */}
      <div className="flex-1 flex flex-col justify-center items-center bg-white p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bem-vindo de volta
            </h1>
            <p className="text-gray-600">
              Entre para acessar todas as ferramentas da plataforma que une
              crescimento e inovação.
            </p>
          </div>

          <LoginForm
            onSubmit={handleSubmit}
            loading={loading}
            error={erro}
          />
        </div>
      </div>
    </div>
  );
}
