"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { clienteService } from "@/infrastructure/di/services";
import { Cliente } from "@/domain/entities/Cliente";
import { EntityDataTable, EntityTableColumn } from "@/presentation/components/Common/EntityDataTable";
import { useEntitySearchPage } from "@/presentation/hooks/common/useEntitySearchPage";
import { CredorFilters } from "@/presentation/components/Credor/CredorFilters";
import { EntityCreateModal } from "@/presentation/components/Common/EntityCreateModal";
import { toast } from "sonner";
import { createClienteSchema, getFirstValidationError } from "@/domain/schemas/cadastroSchemas";

type ClienteSearchState = {
  search: string;
  ativo: string;
  consistencia?: string;
};

const DEFAULT_FILTERS: ClienteSearchState = {
  search: "",
  ativo: "",
  consistencia: "",
};

export default function ClientesPage() {
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newCliente, setNewCliente] = useState<Cliente>({
    razaoSocial: "",
    nomeFantasia: "",
    municipio: "",
    uf: "",
    cnpj: "",
    cpf: "",
    tipo: "cliente",
    ativo: "S",
  });

  const searchClientes = useCallback(async (params: ClienteSearchState & { page: number; pageSize: number }) => {
    const response = await clienteService.search.execute({
      razaoSocial: params.search || undefined,
      ativo: params.ativo || undefined,
      page: params.page,
      pageSize: params.pageSize,
    });
    return { items: response.items || [], total: response.total || 0 };
  }, []);

  const handleCreate = async () => {
    const validation = createClienteSchema.safeParse(newCliente);
    if (!validation.success) {
      toast.error(getFirstValidationError(validation.error, "Dados invalidos para cadastro de cliente"));
      return;
    }

    setSaving(true);
    try {
      await clienteService.create.execute(newCliente);
      toast.success("Cliente cadastrado com sucesso!");
      setShowCreateModal(false);
      setNewCliente({
        razaoSocial: "",
        nomeFantasia: "",
        municipio: "",
        uf: "",
        cnpj: "",
        cpf: "",
        tipo: "cliente",
        ativo: "S",
      });
      await handleSearch(filters, 1, pagination.pageSize);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao salvar cliente");
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
  } = useEntitySearchPage<Cliente, ClienteSearchState>({
    defaultFilters: DEFAULT_FILTERS,
    search: searchClientes,
  });

  const columns: EntityTableColumn<Cliente>[] = [
    { id: "codigo", header: "Código", sortable: true, sortValue: (item) => item.codigo || 0, render: (item) => item.codigo || "-" },
    { id: "razaoSocial", header: "Razão Social / Nome", sortable: true, sortValue: (item) => item.razaoSocial || "", render: (item) => item.razaoSocial },
    { id: "nomeFantasia", header: "Nome Fantasia", sortable: true, sortValue: (item) => item.nomeFantasia || "", render: (item) => item.nomeFantasia || "-" },
    { id: "municipioUf", header: "Município / UF", render: (item) => `${item.municipio || "-"} / ${item.uf || "-"}` },
    { id: "documento", header: "CPF / CNPJ", render: (item) => item.cnpj || item.cpf || "-" },
    { id: "tipo", header: "Tipo", render: (item) => item.tipo || "-" },
    { id: "ativo", header: "Status", sortable: true, sortValue: (item) => item.ativo || "", render: (item) => item.ativo === "S" ? <span className="bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full text-xs font-medium">Ativo</span> : <span className="bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full text-xs font-medium">Inativo</span> },
  ];

  return (
    <div className="flex flex-col w-full px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#0E0E0E]">Clientes</h1>
      </div>

      <div className="mb-4 flex justify-end gap-3">
        <button
          className="bg-[#0048B0] text-white px-5 py-2 rounded-lg hover:bg-[#003c90] transition-colors"
          onClick={() => setShowCreateModal(true)}
        >
          + Novo cliente
        </button>
      </div>

      <CredorFilters
        searchData={filters}
        loading={loading}
        onSearchChange={setFilters}
        onKeyDown={handleKeyDown}
        searchPlaceholder="Buscar clientes por nome ou documento (busca automatica)"
        searchAriaLabel="Buscar clientes por nome ou documento"
      />

      <EntityDataTable
        items={results}
        loading={loading}
        hasSearched={hasSearched}
        columns={columns}
        getItemId={(item, idx) => item.codigo ?? `cliente-${idx}`}
        pagination={pagination}
        totalPages={totalPages}
        onPageChange={(page) => void handleSearch(filters, page, pagination.pageSize)}
        onGoToPage={(page) => void handleSearch(filters, page, pagination.pageSize)}
        onPageSizeChange={(size) => void handleSearch(filters, 1, size)}
        onPreviousPage={() => void handleSearch(filters, pagination.page - 1, pagination.pageSize)}
        onNextPage={() => void handleSearch(filters, pagination.page + 1, pagination.pageSize)}
        onEdit={(item) => router.push(`/cliente/editar/${item.codigo}`)}
      />

      <EntityCreateModal
        show={showCreateModal}
        title="Novo cliente"
        description="Preencha os dados para cadastrar um novo cliente."
        saving={saving}
        saveLabel="Salvar"
        onClose={() => setShowCreateModal(false)}
        onSave={() => void handleCreate()}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0048B0]" placeholder="Razao Social / Nome *" value={newCliente.razaoSocial} onChange={(e) => setNewCliente((prev) => ({ ...prev, razaoSocial: e.target.value }))} />
          <input className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0048B0]" placeholder="Nome Fantasia" value={newCliente.nomeFantasia || ""} onChange={(e) => setNewCliente((prev) => ({ ...prev, nomeFantasia: e.target.value }))} />
          <input className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0048B0]" placeholder="CNPJ" value={newCliente.cnpj || ""} onChange={(e) => setNewCliente((prev) => ({ ...prev, cnpj: e.target.value }))} />
          <input className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0048B0]" placeholder="CPF" value={newCliente.cpf || ""} onChange={(e) => setNewCliente((prev) => ({ ...prev, cpf: e.target.value }))} />
          <input className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0048B0]" placeholder="Municipio" value={newCliente.municipio || ""} onChange={(e) => setNewCliente((prev) => ({ ...prev, municipio: e.target.value }))} />
          <input className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0048B0]" placeholder="UF" maxLength={2} value={newCliente.uf || ""} onChange={(e) => setNewCliente((prev) => ({ ...prev, uf: e.target.value.toUpperCase() }))} />
          <select className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#0048B0]" value={newCliente.tipo || "cliente"} onChange={(e) => setNewCliente((prev) => ({ ...prev, tipo: e.target.value }))}>
            <option value="cliente">Cliente</option>
            <option value="colaborador">Colaborador</option>
          </select>
          <select className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#0048B0]" value={newCliente.ativo} onChange={(e) => setNewCliente((prev) => ({ ...prev, ativo: e.target.value }))}>
            <option value="S">Ativo</option>
            <option value="N">Inativo</option>
          </select>
        </div>
      </EntityCreateModal>
    </div>
  );
}


