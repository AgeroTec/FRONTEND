"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/presentation/stores/authStore";
import { LoginForm } from "@/presentation/components/LoginForm";

export default function LoginPage() {
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const loginStore = useAuthStore((s) => s.login);

  const handleSubmit = async (usuario: string, senha: string) => {
    setLoading(true);
    setErro("");

    try {
      await loginStore(usuario, senha);

      setTimeout(() => {
        router.push("/home");
      }, 200);
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
            Copyright 2023 Unio. Todos os direitos reservados
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
