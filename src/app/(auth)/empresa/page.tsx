"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { empresaService } from "@/infrastructure/di/services";
import { Empresa } from "@/domain/entities/Empresa";
import { EntityDataTable, EntityTableColumn } from "@/presentation/components/Common/EntityDataTable";
import { useEntitySearchPage } from "@/presentation/hooks/common/useEntitySearchPage";
import { CredorFilters } from "@/presentation/components/Credor/CredorFilters";
import { EntityCreateModal } from "@/presentation/components/Common/EntityCreateModal";
import { toast } from "sonner";
import { createEmpresaSchema, getFirstValidationError } from "@/domain/schemas/cadastroSchemas";

type EmpresaSearchState = {
  search: string;
  ativo: string;
  consistencia?: string;
};

const DEFAULT_FILTERS: EmpresaSearchState = {
  search: "",
  ativo: "",
  consistencia: "",
};

export default function EmpresaPage() {
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newEmpresa, setNewEmpresa] = useState<Empresa>({
    nomeempresa: "",
    nomefantasia: "",
    codgrupoempresa: "",
    nucnpj: "",
    uf: "",
    ativo: "S",
  });

  const searchEmpresas = useCallback(async (params: EmpresaSearchState & { page: number; pageSize: number }) => {
    const response = await empresaService.search.execute({
      nomeempresa: params.search || undefined,
      ativo: params.ativo || undefined,
      page: params.page,
      pageSize: params.pageSize,
    });
    return { items: response.items || [], total: response.total || 0 };
  }, []);

  const handleCreate = async () => {
    const validation = createEmpresaSchema.safeParse(newEmpresa);
    if (!validation.success) {
      toast.error(getFirstValidationError(validation.error, "Dados invalidos para cadastro de empresa"));
      return;
    }

    setSaving(true);
    try {
      await empresaService.create.execute(newEmpresa);
      toast.success("Empresa cadastrada com sucesso!");
      setShowCreateModal(false);
      setNewEmpresa({
        nomeempresa: "",
        nomefantasia: "",
        codgrupoempresa: "",
        nucnpj: "",
        uf: "",
        ativo: "S",
      });
      await handleSearch(filters, 1, pagination.pageSize);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao salvar empresa");
    } finally {
      setSaving(false);
    }
  };

  const {
    results,
    loading,
    hasSearched,
    filters,
    setFilters,
    pagination,
    totalPages,
    handleSearch,
    handleKeyDown,
  } = useEntitySearchPage<Empresa, EmpresaSearchState>({
    defaultFilters: DEFAULT_FILTERS,
    search: searchEmpresas,
  });

  const columns: EntityTableColumn<Empresa>[] = [
    { id: "codigo", header: "Código", sortable: true, sortValue: (item) => item.codigo || 0, render: (item) => item.codigo || "-" },
    { id: "nomeempresa", header: "Nome da Empresa", sortable: true, sortValue: (item) => item.nomeempresa || "", render: (item) => item.nomeempresa },
    { id: "codgrupoempresa", header: "Código do Grupo", sortable: true, sortValue: (item) => item.codgrupoempresa || "", render: (item) => item.codgrupoempresa || "-" },
    { id: "uf", header: "UF", render: (item) => item.uf || "-" },
    { id: "ativo", header: "Status", sortable: true, sortValue: (item) => item.ativo || "", render: (item) => item.ativo === "S" ? <span className="bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full text-xs font-medium">Ativo</span> : <span className="bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full text-xs font-medium">Inativo</span> },
  ];

  return (
    <div className="flex flex-col w-full px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#0E0E0E]">Empresas</h1>
      </div>

      <div className="mb-4 flex justify-end gap-3">
        <button
          className="bg-[#0048B0] text-white px-5 py-2 rounded-lg hover:bg-[#003c90] transition-colors"
          onClick={() => setShowCreateModal(true)}
        >
          + Nova empresa
        </button>
      </div>

      <CredorFilters
        searchData={filters}
        loading={loading}
        onSearchChange={setFilters}
        onKeyDown={handleKeyDown}
        searchPlaceholder="Buscar empresas por nome ou CNPJ (busca automatica)"
        searchAriaLabel="Buscar empresas por nome ou CNPJ"
      />

      <EntityDataTable
        items={results}
        loading={loading}
        hasSearched={hasSearched}
        columns={columns}
        getItemId={(item, idx) => item.codigo ?? `empresa-${idx}`}
        pagination={pagination}
        totalPages={totalPages}
        onPageChange={(page) => void handleSearch(filters, page, pagination.pageSize)}
        onGoToPage={(page) => void handleSearch(filters, page, pagination.pageSize)}
        onPageSizeChange={(size) => void handleSearch(filters, 1, size)}
        onPreviousPage={() => void handleSearch(filters, pagination.page - 1, pagination.pageSize)}
        onNextPage={() => void handleSearch(filters, pagination.page + 1, pagination.pageSize)}
        onEdit={(item) => router.push(`/empresa/editar/${item.codigo}`)}
      />

      <EntityCreateModal
        show={showCreateModal}
        title="Nova empresa"
        description="Preencha os dados para cadastrar uma nova empresa."
        saving={saving}
        saveLabel="Salvar"
        onClose={() => setShowCreateModal(false)}
        onSave={() => void handleCreate()}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0048B0]" placeholder="Nome da Empresa *" value={newEmpresa.nomeempresa} onChange={(e) => setNewEmpresa((prev) => ({ ...prev, nomeempresa: e.target.value }))} />
          <input className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0048B0]" placeholder="Nome Fantasia" value={newEmpresa.nomefantasia || ""} onChange={(e) => setNewEmpresa((prev) => ({ ...prev, nomefantasia: e.target.value }))} />
          <input className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0048B0]" placeholder="CNPJ" value={newEmpresa.nucnpj || ""} onChange={(e) => setNewEmpresa((prev) => ({ ...prev, nucnpj: e.target.value }))} />
          <input className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0048B0]" placeholder="Codigo do Grupo" value={newEmpresa.codgrupoempresa || ""} onChange={(e) => setNewEmpresa((prev) => ({ ...prev, codgrupoempresa: e.target.value }))} />
          <input className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0048B0]" placeholder="UF" maxLength={2} value={newEmpresa.uf || ""} onChange={(e) => setNewEmpresa((prev) => ({ ...prev, uf: e.target.value.toUpperCase() }))} />
          <select className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#0048B0]" value={newEmpresa.ativo} onChange={(e) => setNewEmpresa((prev) => ({ ...prev, ativo: e.target.value }))}>
            <option value="S">Ativo</option>
            <option value="N">Inativo</option>
          </select>
        </div>
      </EntityCreateModal>
    </div>
  );
}


