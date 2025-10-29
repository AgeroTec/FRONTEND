"use client";

import { useRouter } from "next/navigation";

export default function LandingPage() {
    const router = useRouter();

    const handleAcessarConta = () => {
        router.push("/login");
    };

    const handleSolicitarCotacao = () => {
        // Aqui você pode redirecionar para um formulário de cotação
        // ou abrir um modal, etc.
        router.push("/cotacao");
    };

    return (
        <div className="flex h-screen bg-white">
            {/* Lado esquerdo - Fundo com letra subjetiva */}
            <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-blue-900 to-blue-700 overflow-hidden">
                {/* Letra U gigante e subjetiva no fundo */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div 
                        className="text-white/5 font-bold"
                        style={{
                            fontSize: '20rem',
                            lineHeight: '0.1',
                            fontFamily: 'verdana, sans-serif',
                            transform: 'translateY(10%)'
                        }}
                    >
                        Unio
                    </div>
                </div>
                
                {/* Conteúdo sobreposto */}
                <div className="relative z-10 w-full flex flex-col justify-between p-12 text-white">
                    {/* Topo - Logo */}
                    <div className="text-2xl font-bold">UNIO</div>

                    {/* Centro - Conteúdo principal */}
                    <div className="text-center mb-20">
                        <div className="text-sm font-light opacity-80 mb-4 tracking-wider">
                            PLATAFORMA DE SOLUÇÕES EMPRESARIAIS
                        </div>
                        <h1 className="text-6xl font-light mb-6 tracking-tight">
                            Transforme seu negócio
                        </h1>
                        <div className="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
                            Conectamos sua empresa às melhores soluções em tecnologia, 
                            gestão e inovação para impulsionar seus resultados.
                        </div>
                    </div>

                    {/* Benefícios */}
                    <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto mb-20">
                        <div className="text-center">
                            <div className="text-3xl font-bold mb-2">+100</div>
                            <div className="text-sm opacity-80">Clientes Ativos</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold mb-2">99%</div>
                            <div className="text-sm opacity-80">Satisfação</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold mb-2">24/7</div>
                            <div className="text-sm opacity-80">Suporte</div>
                        </div>
                    </div>

                    {/* Rodapé */}
                    <div className="text-center">
                        <div className="text-sm opacity-80 mb-2">
                            Pronto para começar?
                        </div>
                        <div className="text-lg opacity-90">
                            Junte-se à nossa comunidade de sucesso
                        </div>
                    </div>
                </div>
            </div>

            {/* Lado direito - Conteúdo principal */}
            <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
                <div className="w-full max-w-md">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-light text-gray-900 mb-4">
                            Bem-vindo à UNIO
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Escolha como deseja continuar sua jornada conosco
                        </p>
                    </div>

                    {/* Cards de opções */}
                    <div className="space-y-6">
                        {/* Card Solicitar Cotação */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 hover:border-blue-200">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                                    Solicitar Cotação
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Ideal para novos clientes. Receba uma proposta personalizada 
                                    para suas necessidades empresariais.
                                </p>
                            </div>
                            <button
                                onClick={handleSolicitarCotacao}
                                className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-semibold text-lg transition-colors shadow-lg hover:shadow-xl"
                            >
                                Solicitar Cotação
                            </button>
                        </div>

                        {/* Card Acessar Conta */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 hover:border-green-200">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                                    Acessar Minha Conta
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Para clientes existentes. Acesse sua conta para gerenciar 
                                    serviços, relatórios e configurações.
                                </p>
                            </div>
                            <button
                                onClick={handleAcessarConta}
                                className="w-full bg-green-600 text-white py-4 px-6 rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-semibold text-lg transition-colors shadow-lg hover:shadow-xl"
                            >
                                Acessar Minha Conta
                            </button>
                        </div>
                    </div>

                    {/* Informações adicionais */}
                    <div className="text-center mt-8">
                        <div className="text-sm text-gray-500">
                            Dúvidas? <span className="text-blue-600 hover:text-blue-500 cursor-pointer font-medium">Fale com nosso time</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-4">
                            Versão 9.5.14.72/9
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}