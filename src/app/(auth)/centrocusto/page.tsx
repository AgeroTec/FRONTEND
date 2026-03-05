"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { centroCustoService } from "@/infrastructure/di/services";
import { CentroCusto } from "@/domain/entities/CentroCusto";
import { EntityDataTable, EntityTableColumn } from "@/presentation/components/Common/EntityDataTable";
import { useEntitySearchPage } from "@/presentation/hooks/common/useEntitySearchPage";
import { CredorFilters } from "@/presentation/components/Credor/CredorFilters";
import { EntityCreateModal } from "@/presentation/components/Common/EntityCreateModal";
import { toast } from "sonner";
import { createCentroCustoSchema, getFirstValidationError } from "@/domain/schemas/cadastroSchemas";

type CentroCustoSearchState = {
  search: string;
  ativo: string;
  consistencia?: string;
};

const DEFAULT_FILTERS: CentroCustoSearchState = {
  search: "",
  ativo: "",
  consistencia: "",
};

export default function CentroCustoPage() {
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newCentroCusto, setNewCentroCusto] = useState<CentroCusto>({
    nomecentrocusto: "",
    nomeempresa: "",
    ativo: "S",
  });

  const searchCentroCusto = useCallback(async (params: CentroCustoSearchState & { page: number; pageSize: number }) => {
    const response = await centroCustoService.search.execute({
      nomecentrocusto: params.search || undefined,
      ativo: params.ativo || undefined,
      page: params.page,
      pageSize: params.pageSize,
    });
    return { items: response.items || [], total: response.total || 0 };
  }, []);

  const handleCreate = async () => {
    const validation = createCentroCustoSchema.safeParse(newCentroCusto);
    if (!validation.success) {
      toast.error(getFirstValidationError(validation.error, "Dados invalidos para cadastro de centro de custo"));
      return;
    }

    setSaving(true);
    try {
      await centroCustoService.create.execute(newCentroCusto);
      toast.success("Centro de custo cadastrado com sucesso!");
      setShowCreateModal(false);
      setNewCentroCusto({
        nomecentrocusto: "",
        nomeempresa: "",
        ativo: "S",
      });
      await handleSearch(filters, 1, pagination.pageSize);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao salvar centro de custo");
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
  } = useEntitySearchPage<CentroCusto, CentroCustoSearchState>({
    defaultFilters: DEFAULT_FILTERS,
    search: searchCentroCusto,
  });

  const columns: EntityTableColumn<CentroCusto>[] = [
    { id: "codigo", header: "Código", sortable: true, sortValue: (item) => item.codigo || 0, render: (item) => item.codigo || "-" },
    { id: "nomecentrocusto", header: "Centro de Custos", sortable: true, sortValue: (item) => item.nomecentrocusto || "", render: (item) => item.nomecentrocusto },
    { id: "nomeempresa", header: "Empresa", sortable: true, sortValue: (item) => item.nomeempresa || "", render: (item) => item.nomeempresa || "-" },
    { id: "ativo", header: "Status", sortable: true, sortValue: (item) => item.ativo || "", render: (item) => item.ativo === "S" ? <span className="bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full text-xs font-medium">Ativo</span> : <span className="bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full text-xs font-medium">Inativo</span> },
  ];

  return (
    <div className="flex flex-col w-full px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#0E0E0E]">Centro de Custos</h1>
      </div>

      <div className="mb-4 flex justify-end gap-3">
        <button
          className="bg-[#0048B0] text-white px-5 py-2 rounded-lg hover:bg-[#003c90] transition-colors"
          onClick={() => setShowCreateModal(true)}
        >
          + Novo centro de custo
        </button>
      </div>

      <CredorFilters
        searchData={filters}
        loading={loading}
        onSearchChange={setFilters}
        onKeyDown={handleKeyDown}
        searchPlaceholder="Buscar centro de custo por nome ou codigo (busca automatica)"
        searchAriaLabel="Buscar centro de custos por nome ou codigo"
      />

      <EntityDataTable
        items={results}
        loading={loading}
        hasSearched={hasSearched}
        columns={columns}
        getItemId={(item, idx) => item.codigo ?? `centrocusto-${idx}`}
        pagination={pagination}
        totalPages={totalPages}
        onPageChange={(page) => void handleSearch(filters, page, pagination.pageSize)}
        onGoToPage={(page) => void handleSearch(filters, page, pagination.pageSize)}
        onPageSizeChange={(size) => void handleSearch(filters, 1, size)}
        onPreviousPage={() => void handleSearch(filters, pagination.page - 1, pagination.pageSize)}
        onNextPage={() => void handleSearch(filters, pagination.page + 1, pagination.pageSize)}
        onEdit={(item) => router.push(`/centrocusto/editar/${item.codigo}`)}
      />

      <EntityCreateModal
        show={showCreateModal}
        title="Novo centro de custo"
        description="Preencha os dados para cadastrar um novo centro de custo."
        saving={saving}
        saveLabel="Salvar"
        onClose={() => setShowCreateModal(false)}
        onSave={() => void handleCreate()}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0048B0]" placeholder="Nome do Centro de Custo *" value={newCentroCusto.nomecentrocusto} onChange={(e) => setNewCentroCusto((prev) => ({ ...prev, nomecentrocusto: e.target.value }))} />
          <input className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0048B0]" placeholder="Nome da Empresa" value={newCentroCusto.nomeempresa || ""} onChange={(e) => setNewCentroCusto((prev) => ({ ...prev, nomeempresa: e.target.value }))} />
          <select className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#0048B0]" value={newCentroCusto.ativo} onChange={(e) => setNewCentroCusto((prev) => ({ ...prev, ativo: e.target.value }))}>
            <option value="S">Ativo</option>
            <option value="N">Inativo</option>
          </select>
        </div>
      </EntityCreateModal>
    </div>
  );
}


