"use client";

import { useCallback, useState } from "react";
import { ContaCorrente } from "@/domain/entities/ContaCorrente";
import { contaCorrenteService } from "@/infrastructure/di/services";
import { EntityDataTable, EntityTableColumn } from "@/presentation/components/Common/EntityDataTable";
import { CredorFilters } from "@/presentation/components/Credor/CredorFilters";
import { useEntitySearchPage } from "@/presentation/hooks/common/useEntitySearchPage";
import { EntityCreateModal } from "@/presentation/components/Common/EntityCreateModal";
import { toast } from "sonner";
import { createContaCorrenteSchema, getFirstValidationError } from "@/domain/schemas/cadastroSchemas";

type ContaCorrenteSearchState = {
  search: string;
  ativo: string;
  consistencia?: string;
};

const DEFAULT_FILTERS: ContaCorrenteSearchState = {
  search: "",
  ativo: "",
  consistencia: "",
};

export default function ContasCorrentesPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newConta, setNewConta] = useState({
    nomeconta: "",
    banco: "",
    agencia: "",
    conta: "",
    digito: "",
  });

  const searchContas = useCallback(async (params: ContaCorrenteSearchState & { page: number; pageSize: number }) => {
    const response = await contaCorrenteService.searchContasCorrentes.execute({
      searchTerm: params.search || undefined,
      ativo: params.ativo || undefined,
      page: params.page,
      pageSize: params.pageSize,
    });

    return {
      items: response.items || [],
      total: response.total || 0,
    };
  }, []);

  const handleCreate = async () => {
    const validation = createContaCorrenteSchema.safeParse({ ...newConta, ativo: "S" });
    if (!validation.success) {
      toast.error(getFirstValidationError(validation.error, "Dados invalidos para cadastro de conta corrente"));
      return;
    }

    setSaving(true);
    try {
      await contaCorrenteService.createContaCorrente.execute({
        nomeconta: newConta.nomeconta.trim(),
        banco: newConta.banco.trim(),
        agencia: newConta.agencia.trim(),
        conta: newConta.conta.trim(),
        digito: newConta.digito.trim() || undefined,
        ativo: "S",
      });
      toast.success("Conta corrente cadastrada com sucesso!");
      setShowCreateModal(false);
      setNewConta({ nomeconta: "", banco: "", agencia: "", conta: "", digito: "" });
      await handleSearch(filters, 1, pagination.pageSize);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao salvar conta corrente");
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
  } = useEntitySearchPage<ContaCorrente, ContaCorrenteSearchState>({
    defaultFilters: DEFAULT_FILTERS,
    search: searchContas,
  });

  const columns: EntityTableColumn<ContaCorrente>[] = [
    { id: "codigo", header: "Código", sortable: true, sortValue: (item) => item.codigo || 0, render: (item) => item.codigo || "-" },
    { id: "nomeconta", header: "Nome da Conta", sortable: true, sortValue: (item) => item.nomeconta || "", render: (item) => item.nomeconta || "-" },
    { id: "empresa", header: "Empresa", sortable: true, sortValue: (item) => item.nomeempresa || "", render: (item) => item.nomeempresa || "-" },
    { id: "banco", header: "Banco", sortable: true, sortValue: (item) => item.banco || "", render: (item) => item.banco || "-" },
    {
      id: "agenciaConta",
      header: "Agência / Conta",
      render: (item) => {
        const agencia = item.agencia || "-";
        const conta = item.conta || "-";
        const digito = item.digito ? `-${item.digito}` : "";
        return `${agencia} / ${conta}${digito}`;
      },
    },
    { id: "titular", header: "Titular", sortable: true, sortValue: (item) => item.titular || "", render: (item) => item.titular || "-" },
    { id: "tipoConta", header: "Tipo", sortable: true, sortValue: (item) => item.tipoConta || "", render: (item) => item.tipoConta || "-" },
    { id: "ativo", header: "Status", sortable: true, sortValue: (item) => item.ativo || "", render: (item) => item.ativo === "S" ? <span className="bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full text-xs font-medium">Ativo</span> : <span className="bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full text-xs font-medium">Inativo</span> },
  ];

  return (
    <div className="flex flex-col w-full px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#0E0E0E]">Contas Correntes</h1>
      </div>

      <div className="mb-4 flex justify-end gap-3">
        <button
          className="bg-[#0048B0] text-white px-5 py-2 rounded-lg hover:bg-[#003c90] transition-colors"
          onClick={() => setShowCreateModal(true)}
        >
          + Nova conta corrente
        </button>
      </div>

      <CredorFilters
        searchData={filters}
        loading={loading}
        onSearchChange={setFilters}
        onKeyDown={handleKeyDown}
        searchPlaceholder="Buscar contas correntes por nome da conta (busca automatica)"
        searchAriaLabel="Buscar contas correntes por nome da conta"
      />

      <EntityDataTable
        items={results}
        loading={loading}
        hasSearched={hasSearched}
        columns={columns}
        getItemId={(item, idx) => item.codigo ?? `conta-${idx}`}
        pagination={pagination}
        totalPages={totalPages}
        onPageChange={(page) => void handleSearch(filters, page, pagination.pageSize)}
        onGoToPage={(page) => void handleSearch(filters, page, pagination.pageSize)}
        onPageSizeChange={(size) => void handleSearch(filters, 1, size)}
        onPreviousPage={() => void handleSearch(filters, pagination.page - 1, pagination.pageSize)}
        onNextPage={() => void handleSearch(filters, pagination.page + 1, pagination.pageSize)}
      />

      <EntityCreateModal
        show={showCreateModal}
        title="Nova conta corrente"
        description="Preencha os dados para cadastrar uma nova conta corrente."
        saving={saving}
        saveLabel="Salvar"
        onClose={() => setShowCreateModal(false)}
        onSave={() => void handleCreate()}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0048B0]" placeholder="Nome da Conta *" value={newConta.nomeconta} onChange={(e) => setNewConta((prev) => ({ ...prev, nomeconta: e.target.value }))} />
          <input className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0048B0]" placeholder="Banco *" value={newConta.banco} onChange={(e) => setNewConta((prev) => ({ ...prev, banco: e.target.value }))} />
          <input className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0048B0]" placeholder="Agencia *" value={newConta.agencia} onChange={(e) => setNewConta((prev) => ({ ...prev, agencia: e.target.value }))} />
          <input className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0048B0]" placeholder="Conta *" value={newConta.conta} onChange={(e) => setNewConta((prev) => ({ ...prev, conta: e.target.value }))} />
          <input className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0048B0]" placeholder="Digito" value={newConta.digito} onChange={(e) => setNewConta((prev) => ({ ...prev, digito: e.target.value }))} />
        </div>
      </EntityCreateModal>
    </div>
  );
}
