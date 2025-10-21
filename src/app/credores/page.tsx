'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCredores } from "@/presentation/hooks/useCredores";
import { LoadingSpinner } from "@/presentation/components/LoadingSpinner";
import { Pagination } from "@/presentation/components/Pagination";

interface SearchData {
  search: string;
  doc: string;
  ativo: string;
}

export default function CredoresPage() {
  const router = useRouter();
  const { 
    results, 
    loading, 
    error, 
    pagination,
    search, 
    changePage,
    changePageSize,
    clearResults 
  } = useCredores();
  
  const [searchData, setSearchData] = useState<SearchData>({
    search: "",
    doc: "",
    ativo: "",
  });

  const handleSearch = () => {
    search(searchData);
  };

  const handleClear = () => {
    setSearchData({ search: "", doc: "", ativo: "" });
    clearResults();
  };

  const handleInputChange = (field: keyof SearchData, value: string) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cadastro de Credores</h1>
          <p className="text-lg text-gray-600">Gerenciamento de credores</p>
        </div>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
          onClick={() => router.push("/credor/novo")}
        >
          Novo Credor
        </button>
      </div>

      {/* Mensagem de Erro */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <strong>Erro:</strong> {error}
        </div>
      )}

      {/* Filtros de Busca */}
      <div className="mb-6 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Parâmetros da consulta</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar por nome
            </label>
            <input
              placeholder="Digite nome, CNPJ ou CPF..."
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchData.search}
              onChange={(e) => handleInputChange('search', e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por documento
            </label>
            <input
              placeholder="CNPJ ou CPF..."
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchData.doc}
              onChange={(e) => handleInputChange('doc', e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchData.ativo}
              onChange={(e) => handleInputChange('ativo', e.target.value)}
            >
              <option value="S">Ativo</option>
              <option value="N">Inativo</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors font-medium flex items-center"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? <LoadingSpinner size="sm" text="Pesquisando..." /> : "Pesquisar"}
          </button>
          
          <button
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            onClick={handleClear}
            disabled={loading}
          >
            Limpar
          </button>
        </div>
      </div>

      {/* Tabela de Resultados */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fantasia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CNPJ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CPF
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <LoadingSpinner text="Carregando credores..." />
                  </td>
                </tr>
              ) : results.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    {error ? "Erro ao carregar dados" : "Nenhum credor encontrado"}
                  </td>
                </tr>
              ) : (
                results.map((credor) => (
                  <tr key={credor.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {credor.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {credor.nome || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {credor.fantasia || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {credor.cnpj || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {credor.cpf || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        credor.ativo === 'S' 
                          ? 'bg-green-100 text-green-800' 
                          : credor.ativo === 'N' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {credor.ativo === 'S' ? 'Ativo' : credor.ativo === 'N' ? 'Inativo' : 'Desconhecido'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        onClick={() => router.push(`/credor/editar/${credor.id}`)}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          pageSize={pagination.pageSize}
          hasPrevious={pagination.hasPrevious}
          hasNext={pagination.hasNext}
          onPageChange={changePage}
          onPageSizeChange={changePageSize}
          loading={loading}
        />
      </div>
    </div>
  );
}