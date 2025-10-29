"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ✅ Interface corrigida baseada na resposta real da API
interface Credor {
  id: number;
  nome: string;
  fantasia: string | null;
  cnpj: string | null;
  cpf: string | null;
  ativo: string;
}

// ✅ Interface para a resposta paginada
interface PagedResult {
  items: Credor[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

// ✅ Função para gerar UUID simples
function generateSimpleId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// ✅ Função utilitária de fetch seguro COM HEADERS
async function safeFetchJson(url: string): Promise<PagedResult> {
  try {
    console.log("🔄 Iniciando fetch para:", url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        "X-Tenant-Id": "11111111-1111-1111-1111-111111111111",
        "X-User-Id": "admin",
        "X-User-Name": "Administrador",
        "X-Correlation-Id": generateSimpleId(),
        "Accept-Language": "pt-BR",
        "Authorization": "Basic " + btoa("admin:admin"),
        "Content-Type": "application/json",
        "accept": "application/json",
      },
      mode: 'cors',
    });
    
    console.log("📡 Response status:", response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }

    const text = await response.text();
    console.log("📄 Response text:", text);
    
    if (!text) {
      return { 
        items: [], 
        totalCount: 0, 
        pageNumber: 1, 
        pageSize: 20, 
        totalPages: 0, 
        hasPrevious: false, 
        hasNext: false 
      };
    }

    const data = JSON.parse(text);
    console.log("✅ Dados parseados:", data);
    
    return data;
  } catch (err) {
    console.error("❌ Erro na requisição:", err);
    throw err;
  }
}

export default function CredoresPage() {
  const router = useRouter();
  const [results, setResults] = useState<Credor[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState({
    search: "",
    doc: "",
    ativo: "",
  });

  // ✅ Função para testar a conexão primeiro
  const testConnection = async () => {
    try {
      console.log("🧪 Testando conexão com a API...");
      const response = await fetch('http://localhost:5103', {
        method: 'GET',
        mode: 'cors'
      });
      console.log("✅ Servidor respondeu:", response.status);
      return true;
    } catch (error) {
      console.error("❌ Servidor não respondeu:", error);
      return false;
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      // ✅ Testa se o servidor está online
      const isOnline = await testConnection();
      if (!isOnline) {
        alert("Servidor não está respondendo. Verifique se a API está rodando na porta 5103.");
        return;
      }

      // ✅ Constrói parâmetros conforme a API espera (note o "P" maiúsculo)
      const params: Record<string, string> = {
        Page: "1",        // ✅ Com P maiúsculo
        PageSize: "20"    // ✅ Com P maiúsculo
      };

      // ✅ Adiciona filtros apenas se preenchidos
      if (searchData.search) params.search = searchData.search;
      if (searchData.doc) params.doc = searchData.doc;
      if (searchData.ativo) params.ativo = searchData.ativo;

      const query = new URLSearchParams(params).toString();
      const url = `http://localhost:5103/api/v1/credores?${query}`;
      console.log("🔗 URL completa:", url);
      
      const data = await safeFetchJson(url);
      setResults(data.items || []);
    } catch (error) {
      console.error("Erro ao buscar credores:", error);
      alert(`Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}\n\nVerifique:\n1. Se a API está rodando\n2. Se a URL está correta\n3. Se não há bloqueio de CORS`);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl text-black font-bold">Cadastro de Credores</h1>
          <p className="text-lg text-gray-600">Credores</p>
        </div>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => router.push("/credor/novo")}
        >
          Novo
        </button>
      </div>

      {/* Parâmetros da consulta */}
      <div className="mb-6 border rounded-lg p-4 bg-gray-50 text-black">
        <h2 className="text-lg font-semibold text-gray-600 mb-4">Parâmetros da consulta</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            placeholder="Buscar por nome, CNPJ ou CPF"
            className="border rounded p-2"
            value={searchData.search}
            onChange={(e) => setSearchData({ ...searchData, search: e.target.value })}
          />
          <input
            placeholder="Filtrar por CNPJ/CPF"
            className="border rounded p-2"
            value={searchData.doc}
            onChange={(e) => setSearchData({ ...searchData, doc: e.target.value })}
          />
          <select
            className="border rounded p-2"
            value={searchData.ativo}
            onChange={(e) => setSearchData({ ...searchData, ativo: e.target.value })}
          >
            <option value="">Todos</option>
            <option value="S">Ativo</option>
            <option value="N">Inativo</option>
          </select>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "Pesquisando..." : "Pesquisar"}
          </button>
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            onClick={() => {
              setSearchData({ search: "", doc: "", ativo: "" });
              setResults([]);
            }}
          >
            Limpar
          </button>
        </div>
      </div>

      {/* Grid de resultados CORRIGIDO */}
      <div className="overflow-x-auto border rounded-lg text-black">
  <table className="w-full border-collapse">
    <thead className="bg-gray-100">
      <tr>
        <th className="border px-4 py-2 text-left">Código</th>
        <th className="border px-4 py-2 text-left">Nome</th>
        <th className="border px-4 py-2 text-left">Fantasia</th>
        <th className="border px-4 py-2 text-left">CNPJ</th>
        <th className="border px-4 py-2 text-left">CPF</th>
        <th className="border px-4 py-2 text-left">Status</th>
        <th className="border px-4 py-2 text-left">Ações</th>
      </tr>
    </thead>
    <tbody>
      {loading ? (
        <tr>
          <td colSpan={7} className="border px-4 py-6 text-center text-gray-300">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
              Carregando...
            </div>
          </td>
        </tr>
      ) : results.length === 0 ? (
        <tr>
          <td colSpan={7} className="border px-4 py-6 text-center text-gray-300">
            Nenhum registro encontrado
          </td>
        </tr>
      ) : (
        results.map((item) => (
          <tr key={item.id} className="hover:bg-gray-50">
            <td className="border px-4 py-2">{item.id}</td>
            <td className="border px-4 py-2">{item.nome || "-"}</td>
            <td className="border px-4 py-2">{item.fantasia || "-"}</td>
            <td className="border px-4 py-2">{item.cnpj || "-"}</td>
            <td className="border px-4 py-2">{item.cpf || "-"}</td>
            <td className="border px-4 py-2">
              {item.ativo === 'S' ? 'Ativo' : item.ativo === 'N' ? 'Inativo' : 'Desconhecido'}
            </td>
            <td className="border px-4 py-2">
              <button
                className="text-blue-600 hover:underline"
                onClick={() => router.push(`/credor/editar/${item.id}`)}
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
    </div>
  );
}