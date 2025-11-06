"use client";

import { useCallback, useEffect, useState } from "react";

import { credorService } from "@/application/services/CredorService";
import { Credor } from "@/domain/entities/Credor";
import { CredorSearchInput } from "@/domain/schemas/credorSchemas";

type FilterState = {
  search: string;
  doc: string;
  ativo: string;
};

type FormState = {
  tipoCredor: string;
  tipoPessoa: string;
  cnpjCpf: string;
  razaoSocial: string;
  fantasia: string;
  microempresa: boolean;
  transportadora: boolean;
  estrangeiro: boolean;
  inscricaoEstadual: string;
  regimeTributacao: string;
  tipoServico: string;
  naturezaRendimento: string;
  cprb: string;
  associacaoDesportiva: boolean;
  ativo: "S" | "N";
};

const DEFAULT_PAGE_SIZE = 10;

const createInitialFilters = (): FilterState => ({
  search: "",
  doc: "",
  ativo: "",
});

const createInitialFormState = (): FormState => ({
  tipoCredor: "",
  tipoPessoa: "",
  cnpjCpf: "",
  razaoSocial: "",
  fantasia: "",
  microempresa: false,
  transportadora: false,
  estrangeiro: false,
  inscricaoEstadual: "",
  regimeTributacao: "",
  tipoServico: "",
  naturezaRendimento: "",
  cprb: "",
  associacaoDesportiva: false,
  ativo: "S",
});

export default function CredoresPage() {
  const [results, setResults] = useState<Credor[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>(() => createInitialFilters());
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
  });
  const [saving, setSaving] = useState(false);

  // Estado do modal
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [formData, setFormData] = useState<FormState>(() => createInitialFormState());

  const executeSearch = useCallback(async (params: CredorSearchInput) => {
    setLoading(true);
    try {
      const response = await credorService.search.execute(params);
      setResults(response.items);
      setPagination({
        page: response.page,
        pageSize: response.pageSize,
        total: response.total,
      });
    } catch (error) {
      console.error("Erro ao buscar credores:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Erro ao buscar credores. Verifique a API.";
      alert(message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const buildSearchParams = (pageOverride?: number): CredorSearchInput => {
    const payload: CredorSearchInput = {
      page: pageOverride ?? pagination.page,
      pageSize: pagination.pageSize,
    };

    if (filters.search.trim()) {
      payload.search = filters.search.trim();
    }

    if (filters.doc.trim()) {
      payload.doc = filters.doc.trim();
    }

    if (filters.ativo) {
      payload.ativo = filters.ativo;
    }

    return payload;
  };

  const handleSearch = async () => {
    await executeSearch(buildSearchParams(1));
  };

  useEffect(() => {
    void executeSearch({ page: 1, pageSize: DEFAULT_PAGE_SIZE });
  }, [executeSearch]);

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(createInitialFormState());
    setModalStep(1);
  };

  const handleOpenModal = () => {
    resetForm();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await credorService.create.execute({
        nome: formData.razaoSocial,
        fantasia: formData.fantasia || undefined,
        cnpj: formData.tipoPessoa === "juridica" ? formData.cnpjCpf : undefined,
        cpf: formData.tipoPessoa === "fisica" ? formData.cnpjCpf : undefined,
        ativo: formData.ativo,
      });
      alert("Credor cadastrado com sucesso!");
      handleCloseModal();
      await executeSearch(buildSearchParams(1));
    } catch (error) {
      console.error("Erro ao salvar credor:", error);
      const message =
        error instanceof Error ? error.message : "Erro ao salvar credor.";
      alert(message);
    } finally {
      setSaving(false);
    }
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
            onClick={handleOpenModal}
          >
            + Novo credor
          </button>
        </div>
      </div>

      {/* Barra de busca */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-[220px] relative">
          <input
            type="text"
            placeholder="Buscar por nome, e-mail ou código"
            className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-[15px] text-[#111827] placeholder-gray-300"
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
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

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Documento (CPF/CNPJ)"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[15px] text-[#111827] placeholder-gray-300"
            value={filters.doc}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, doc: e.target.value }))
            }
          />
        </div>

        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-[15px] text-[#111827] bg-white"
          value={filters.ativo}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, ativo: e.target.value }))
          }
        >
          <option value="">Status</option>
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
                onClick={handleCloseModal}
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[#111827]">Tipo de credor*</label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={formData.tipoCredor}
                      onChange={(e) => updateField("tipoCredor", e.target.value)}
                    >
                      <option value="">Selecione</option>
                      <option value="fornecedor">Fornecedor</option>
                      <option value="colaborador">Colaborador</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#111827]">Tipo de pessoa*</label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={formData.tipoPessoa}
                      onChange={(e) => updateField("tipoPessoa", e.target.value)}
                    >
                      <option value="">Selecione</option>
                      <option value="fisica">Física</option>
                      <option value="juridica">Jurídica</option>
                    </select>
                  </div>
                </div>

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
                  <div>
                    <label className="text-sm font-medium text-[#111827]">Status*</label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={formData.ativo}
                      onChange={(e) =>
                        updateField("ativo", e.target.value as FormState["ativo"])
                      }
                    >
                      <option value="S">Ativo</option>
                      <option value="N">Desativado</option>
                    </select>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="flex gap-6 mt-2">
                  <label className="flex items-center gap-2 text-sm text-[#111827]">
                    <input
                      type="checkbox"
                      checked={formData.microempresa}
                      onChange={(e) => updateField("microempresa", e.target.checked)}
                    />
                    Microempresa
                  </label>
                  <label className="flex items-center gap-2 text-sm text-[#111827]">
                    <input
                      type="checkbox"
                      checked={formData.transportadora}
                      onChange={(e) => updateField("transportadora", e.target.checked)}
                    />
                    Transportadora
                  </label>
                  <label className="flex items-center gap-2 text-sm text-[#111827]">
                    <input
                      type="checkbox"
                      checked={formData.estrangeiro}
                      onChange={(e) => updateField("estrangeiro", e.target.checked)}
                    />
                    Estrangeiro
                  </label>
                </div>
              </div>
            )}

            {/* Conteúdo Etapa 2 */}
            {modalStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#111827] mb-2">Fiscal</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[#111827]">Inscrição estadual*</label>
                    <input
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Digite"
                      value={formData.inscricaoEstadual}
                      onChange={(e) => updateField("inscricaoEstadual", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#111827]">Regime de tributação*</label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={formData.regimeTributacao}
                      onChange={(e) => updateField("regimeTributacao", e.target.value)}
                    >
                      <option value="">Selecione</option>
                      <option value="simples">Simples Nacional</option>
                      <option value="lucro_presumido">Lucro Presumido</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-[#111827]">Tipo de serviço preponderante*</label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={formData.tipoServico}
                    onChange={(e) => updateField("tipoServico", e.target.value)}
                  >
                    <option value="">Selecione</option>
                    <option value="servico">Serviço</option>
                    <option value="comercio">Comércio</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-[#111827]">Natureza do rendimento</label>
                  <input
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Digite"
                    value={formData.naturezaRendimento}
                    onChange={(e) => updateField("naturezaRendimento", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[#111827]">CPRB (anos)*</label>
                  <input
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Digite"
                    value={formData.cprb}
                    onChange={(e) => updateField("cprb", e.target.value)}
                  />
                </div>

                <label className="flex items-center gap-2 text-sm text-[#111827] mt-2">
                  <input
                    type="checkbox"
                    checked={formData.associacaoDesportiva}
                    onChange={(e) => updateField("associacaoDesportiva", e.target.checked)}
                  />
                  Associação desportiva
                </label>
              </div>
            )}

            {/* Rodapé do modal */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCloseModal}
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
                  disabled={saving}
                  className={`bg-[#0048B0] text-white px-5 py-2 rounded-md transition ${
                    saving ? "opacity-60 cursor-not-allowed" : "hover:bg-[#003c90]"
                  }`}
                >
                  {saving ? "Salvando..." : "Salvar"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
