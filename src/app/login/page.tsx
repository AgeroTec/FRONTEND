"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import sideLeft from "./side-left.svg";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [lembrar, setLembrar] = useState(false);
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // login provisório fixo
        if (email === "admin@teste.com" && senha === "123456") {
            localStorage.setItem("auth", "true");
            setErro("");
            router.push("/home");
        } else {
            setErro("E-mail ou senha inválidos!");
        }
    };

    return (
        <div className="flex h-screen bg-white">
            {/* Seção da imagem (lado esquerdo) */}
            <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-blue-900 to-blue-700">
    <div className="absolute inset-0 flex flex-col items-center justify-between p-12 text-white">
        {/* Logo topo - Centralizado */}
        <div className="text-5xl font-bold mt-8">UNIO</div>
        
        {/* Texto central */}
        <div className="max-w-md text-center">
            <div className="text-sm font-medium text-blue-200 mb-2">PLATAFORMA - DESENVOLVIMENTO</div>
            <h2 className="text-4xl font-bold mb-4">Parceria de crescimento e desenvolvimento.</h2>
            <p className="text-blue-100 text-lg">
                Tela para desenvolvimento.
            </p>
        </div>
        
        {/* Copyright */}
        <div className="text-sm text-blue-300">
            Copyright 2023 Unio. Todos os direitos reservados
        </div>
    </div>
</div>

            {/* Seção do formulário (lado direito) */}
            <div className="flex-1 flex flex-col justify-center items-center bg-white p-8">
                <div className="w-full max-w-md">
                    {/* Cabeçalho */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Bem-vindo de volta
                        </h1>
                        <p className="text-gray-600">
                            Entre para acessar todas as ferramentas da plataforma que une crescimento e inovação.
                        </p>
                    </div>

                    {/* Formulário */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Campo Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                E-mail
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="seu@email.com"
                            />
                        </div>

                        {/* Campo Senha */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Senha
                            </label>
                            <input
                                type="password"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Sua senha"
                            />
                        </div>

                        {/* Opções de login */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="lembrar"
                                    checked={lembrar}
                                    onChange={(e) => setLembrar(e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="lembrar" className="ml-2 block text-sm text-gray-700">
                                    Lembrar de mim
                                </label>
                            </div>
                            <button
                                type="button"
                                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                            >
                                Esqueceu sua senha?
                            </button>
                        </div>

                        {erro && (
                            <p className="text-red-500 text-sm text-center">{erro}</p>
                        )}

                        {/* Botão Entrar */}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium transition-colors"
                        >
                            Entrar
                        </button>

                        {/* Linha divisória */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                        </div>

                        {/* Criar conta */}
                        <div className="text-center">
                            <span className="text-gray-600 text-sm">
                                Não tem uma conta?{" "}
                            </span>
                            <button
                                type="button"
                                className="text-blue-600 hover:text-blue-500 font-medium text-sm"
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