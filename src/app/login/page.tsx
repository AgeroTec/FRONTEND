"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/presentation/stores/authStore";

export default function LoginPage() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [lembrar, setLembrar] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const loginStore = useAuthStore((s) => s.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro("");

    try {
      // tenta login
      await loginStore(usuario, senha);

      // salva se "lembrar" estiver marcado
      if (lembrar) {
        const authState = useAuthStore.getState();
        localStorage.setItem(
          "auth-store",
          JSON.stringify({
            user: authState.user,
            isAuthenticated: true,
            tokens: authState.tokens,
          })
        );
      }

      // 🔁 Aguarda atualização do estado antes de redirecionar
      setTimeout(() => {
        router.push("/home"); // ← se sua rota estiver em (auth)/home, use "/home"
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuário
              </label>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite seu usuário"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite sua senha"
                required
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="lembrar"
                  checked={lembrar}
                  onChange={(e) => setLembrar(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={loading}
                />
                <label
                  htmlFor="lembrar"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Lembrar de mim
                </label>
              </div>
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                disabled={loading}
              >
                Esqueceu sua senha?
              </button>
            </div>

            {erro && (
              <p className="text-red-500 text-sm text-center">{erro}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
            </div>

            <div className="text-center">
              <span className="text-gray-600 text-sm">
                Não tem uma conta?{" "}
              </span>
              <button
                type="button"
                className="text-blue-600 hover:text-blue-500 font-medium text-sm"
                disabled={loading}
              >
                Criar uma conta
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
