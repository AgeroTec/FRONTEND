"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Interfaces originais
interface Credor {
  id: number;
  nome: string;
  fantasia: string | null;
  cnpj: string | null;
  cpf: string | null;
  ativo: string;
}

interface PagedResult {
  items: Credor[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

// Função utilitária
function generateSimpleId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Fetch seguro
async function safeFetchJson(url: string): Promise<PagedResult> {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "X-Tenant-Id": "f0e25b5a-598d-4bb9-942f-5f6710cb200a",
      "X-Correlation-Id": generateSimpleId(),
      "Accept-Language": "pt-BR",
      "Content-Type": "application/json",
      accept: "application/json",
    },
    mode: "cors",
  });

  if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);

  const text = await response.text();
  return text
    ? JSON.parse(text)
    : {
        items: [],
        totalCount: 0,
        pageNumber: 1,
        pageSize: 20,
        totalPages: 0,
        hasPrevious: false,
        hasNext: false,
      };
}

export default function CredoresPage() {
  const router = useRouter();
  const [results, setResults] = useState<Credor[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState({ search: "", ativo: "", tipo: "" });

  // Estado do modal
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    ativo: "",
    cnpjCpf: "",
    razaoSocial: "",
    fantasia: "",
  });

  // Buscar credores
  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        Page: "1",
        PageSize: "10",
        ...(searchData.search && { search: searchData.search }),
        ...(searchData.ativo && { ativo: searchData.ativo }),
        ...(searchData.tipo && { tipo: searchData.tipo }),
      });
      const url = `http://localhost:5103/api/v1/credores?${params}`;
      const data = await safeFetchJson(url);
      setResults(data.items || []);
    } catch (error) {
      console.error("Erro ao buscar credores:", error);
      alert("Erro ao buscar credores. Verifique a API.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Controle de campos
  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    alert("http://localhost:5103/api/v1/credores");
    setShowModal(false);
  };

  return (
    <div className="flex flex-col w-full px-8 py-6">
      {/* Título */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-[#0E0E0E]">Credores</h1>

        <div className="flex gap-3">
          <button className="border border-[#D1D5DB] text-[#111827] px-4 py-2 rounded-lg hover:bg-gray-50 transition">
            Importar
          </button>
          <button
            className="bg-[#0048B0] text-white px-5 py-2 rounded-lg hover:bg-[#003c90] transition"
            onClick={() => {
              setShowModal(true);
              setModalStep(1);
            }}
          >
            + Novo credor
          </button>
        </div>
      </div>

      {/* Barra de busca */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Buscar por nome, e-mail ou código"
            className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-[15px] text-[#111827] placeholder-gray-300"
            value={searchData.search}
            onChange={(e) => setSearchData({ ...searchData, search: e.target.value })}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35M9.5 17A7.5 7.5 0 109.5 2a7.5 7.5 0 000 15z"
            />
          </svg>
        </div>

        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-[15px] text-[#111827] bg-white"
          value={searchData.tipo}
          onChange={(e) => setSearchData({ ...searchData, tipo: e.target.value })}
        >
          <option value="fornecedor">Fornecedor</option>
          <option value="colaborador">Colaborador</option>
          <option value="corretor">Corretor</option>
        </select>

        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-[15px] text-[#111827] bg-white"
          value={searchData.ativo}
          onChange={(e) => setSearchData({ ...searchData, ativo: e.target.value })}
        >
          <option value="S">Ativo</option>
          <option value="N">Desativado</option>
        </select>

        <button
          onClick={handleSearch}
          className="bg-[#0048B0] text-white px-4 py-2 rounded-lg hover:bg-[#003c90] transition"
          disabled={loading}
        >
          {loading ? "Pesquisando..." : "Pesquisar"}
        </button>
      </div>

      {/* Tabela */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#F9FAFB] text-[#111827] text-sm font-semibold border-b">
            <tr>
              <th className="px-6 py-3">Nome fantasia</th>
              <th className="px-6 py-3">Telefone principal</th>
              <th className="px-6 py-3">Município/UF</th>
              <th className="px-6 py-3">CNPJ/CPF</th>
              <th className="px-6 py-3">Tipo de credor</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
<tbody className="text-[#111827] text-sm">
  {loading ? (
    <tr>
      <td colSpan={7} className="text-center py-6 text-gray-500">
        Carregando...
      </td>
    </tr>
  ) : results.length === 0 ? (
    <tr>
      <td colSpan={7} className="text-center py-6 text-gray-400">
        Nenhum registro encontrado
      </td>
    </tr>
  ) : (
    results.map((c) => (
      <tr key={c.id} className="hover:bg-gray-50 border-b last:border-none">
        <td className="px-6 py-3">{c.fantasia || c.nome}</td>
        <td className="px-6 py-3">(--) ---- ----</td>
        <td className="px-6 py-3">Cidade/UF</td>
        <td className="px-6 py-3">{c.cnpj || c.cpf}</td>
        <td className="px-6 py-3">Fornecedor</td>
        <td className="px-6 py-3">
          {c.ativo === "S" ? (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
              Ativo
            </span>
          ) : (
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
              Desativado
            </span>
          )}
        </td>
        <td className="px-6 py-3 text-right">
          <button className="text-gray-600 hover:text-[#0048B0]">•••</button>
        </td>
      </tr>
    ))
  )}
</tbody>
        </table>
      </div>

      {/* ===== MODAL DE CADASTRO ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl p-6 animate-fadeIn">
            {/* Cabeçalho */}
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="text-xl font-semibold text-[#111827]">Novo credor</h2>
                <p className="text-sm text-[#6B7280]">
                  Preencha os dados para criar um novo credor no sistema.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>

            {/* Etapa e progresso */}
            <p className="text-sm text-[#0048B0] mb-1">
              Etapa {modalStep}/2
            </p>
            <div className="h-1 bg-gray-200 rounded-full mb-5">
              <div
                className={`h-1 rounded-full transition-all duration-300 ${
                  modalStep === 1 ? "w-1/2 bg-[#0048B0]" : "w-full bg-[#0048B0]"
                }`}
              ></div>
            </div>

            {/* Conteúdo Etapa 1 */}
            {modalStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#111827] mb-2">Identificação</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[#111827]">CNPJ/CPF*</label>
                    <input
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Digite"
                      value={formData.cnpjCpf}
                      onChange={(e) => updateField("cnpjCpf", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[#111827]">
                      Razão Social/Nome*
                    </label>
                    <input
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Digite"
                      value={formData.razaoSocial}
                      onChange={(e) => updateField("razaoSocial", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[#111827]">Fantasia*</label>
                    <input
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Digite"
                      value={formData.fantasia}
                      onChange={(e) => updateField("fantasia", e.target.value)}
                    />
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="flex gap-6 mt-2">

                </div>
              </div>
            )}

            {/* Conteúdo Etapa 2 */}
            {modalStep === 2 && (
                  <div>
                    <h3 className="text-lg font-semibold text-[#111827] mb-2">Status do Cadastro</h3>
                    <label className="text-sm font-medium text-[#111827]">Ativo*</label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={formData.ativo}
                      onChange={(e) => updateField("Ativo", e.target.value)}
                    >
                      <option value="Ativo">Ativo</option>
                      <option value="Inativo">Inativo</option>
                    </select>
                  </div>
            )}

            {/* Rodapé do modal */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="border border-gray-300 px-4 py-2 rounded-md text-[#111827]"
              >
                Cancelar
              </button>
              {modalStep === 1 ? (
                <button
                  onClick={() => setModalStep(2)}
                  className="bg-[#0048B0] text-white px-5 py-2 rounded-md hover:bg-[#003c90]"
                >
                  Próximo
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="bg-[#0048B0] text-white px-5 py-2 rounded-md hover:bg-[#003c90]"
                >
                  Salvar
                </button>
                
              )}
              {modalStep === 2 ? (
                <button
                  onClick={() => setModalStep(1)}
                  className="bg-[#0048B0] text-white px-5 py-2 rounded-md hover:bg-[#003c90]"
                >
                  Anterior
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="bg-[#0048B0] text-white px-5 py-2 rounded-md hover:bg-[#003c90]"
                >
                  Salvar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
