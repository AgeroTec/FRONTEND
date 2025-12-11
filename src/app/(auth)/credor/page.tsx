"use client";

import { useEffect, useRef, useState } from "react";
import { useCredorList } from "@/presentation/hooks/credor/useCredorList";
import { useCredorForm } from "@/presentation/hooks/credor/useCredorForm";
import { CredorHeader } from "@/presentation/components/Credor/CredorHeader";
import { CredorFilters } from "@/presentation/components/Credor/CredorFilters";
import { CredorTable } from "@/presentation/components/Credor/CredorTable";
import { CredorTableSkeleton } from "@/presentation/components/Credor/CredorTableSkeleton";
import { CredorModal } from "@/presentation/components/Credor/CredorModal";
import { SuccessModal } from "@/presentation/components/Credor/SuccessModal";
import { ErrorModal } from "@/presentation/components/Credor/ErrorModal";
import { CredorDrawer } from "@/presentation/components/Credor/CredorDrawer";
import { Credor } from "@/domain/entities/Credor";
import { credorService } from "@/application/services/CredorService";
import { toast } from "sonner";

export default function CredoresPage() {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedCredor, setSelectedCredor] = useState<Credor | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const {
    results,
    loading,
    searchData,
    pagination,
    sortField,
    sortOrder,
    selectedIds,
    allSelected,
    someSelected,
    setSearchData,
    handleSearch,
    clearFilters,
    handleSort,
    totalPages,
    setPageSize,
    goToPage,
    handleDelete,
    handleToggleStatus,
    toggleSelectAll,
    toggleSelectOne,
  } = useCredorList();

  const {
    showModal,
    editingId,
    formData,
    fieldErrors,
    saving,
    checkingDuplicate,
    showSuccessModal,
    showErrorModal,
    successMessage,
    errorMessage,
    openModal,
    closeModal,
    openEditModal,
    updateField,
    handleSave,
    closeSuccessModal,
    closeErrorModal,
    retryLastAction,
  } = useCredorForm();

  // Desativa o skeleton após o primeiro carregamento
  useEffect(() => {
    if (!loading && initialLoad) {
      setInitialLoad(false);
    }
  }, [loading, initialLoad]);

  useEffect(() => {
    const handleGlobalKeyboard = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !showModal) {
        switch (e.key.toLowerCase()) {
          case 'f':
            e.preventDefault();
            searchInputRef.current?.focus();
            break;
          case 'n':
            e.preventDefault();
            openModal();
            break;
          case 'l':
            e.preventDefault();
            clearFilters();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyboard);
    return () => window.removeEventListener('keydown', handleGlobalKeyboard);
  }, [showModal, openModal, clearFilters]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleSearch(1);
    }
  };

  const onSaveSuccess = () => {
    handleSearch(pagination.page);
  };

  const handleViewCredor = (credor: Credor) => {
    setSelectedCredor(credor);
    setShowDrawer(true);
  };

  const handleCloseDrawer = () => {
    setShowDrawer(false);
    setSelectedCredor(null);
  };

  const handleSaveFromDrawer = async (id: number, data: Partial<Credor>) => {
    try {
      await credorService.patch.execute(id, data);
      toast.success("Credor atualizado com sucesso!");
      handleSearch(pagination.page);
      // Atualizar o credor selecionado com os novos dados
      if (selectedCredor) {
        setSelectedCredor({ ...selectedCredor, ...data });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao atualizar credor";
      toast.error(message);
      throw error;
    }
  };

  const handleDeleteFromDrawer = async (credor: Credor) => {
    setShowDrawer(false);
    setSelectedCredor(null);
    await handleDelete(credor);
  };

  const handleToggleStatusFromDrawer = async (credor: Credor) => {
    await handleToggleStatus(credor);

    // Update selectedCredor to refresh drawer in real-time
    if (selectedCredor && selectedCredor.codigo === credor.codigo) {
      const newStatus = credor.ativo === "S" ? "N" : "S";
      setSelectedCredor({ ...selectedCredor, ativo: newStatus });
    }
  };

  return (
    <div className="flex flex-col w-full px-8 py-6">
      <CredorHeader />

      <div className="mb-4 flex justify-end gap-3">
        <button
          onClick={() => {/* TODO: Implementar importação */}}
          className="bg-white text-[#0048B0] px-5 py-2 rounded-lg hover:bg-[#0048B0] hover:text-white transition-colors flex items-center gap-2 shadow-sm"
          aria-label="Importar credores"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          Importar
        </button>
        <button
          onClick={openModal}
          className="bg-[#0048B0] text-white px-5 py-2 rounded-lg hover:bg-[#003c90] transition-colors"
          aria-label="Cadastrar novo credor"
        >
          + Novo credor
        </button>
      </div>

      <CredorFilters
        searchData={searchData}
        loading={loading}
        onSearchChange={setSearchData}
        onSearch={() => handleSearch(1)}
        onClear={clearFilters}
        onKeyPress={handleKeyPress}
        searchInputRef={searchInputRef}
      />

      {initialLoad && loading ? (
        <CredorTableSkeleton />
      ) : (
        <CredorTable
          results={results}
          loading={loading}
          pagination={pagination}
          totalPages={totalPages}
          sortField={sortField}
          sortOrder={sortOrder}
          selectedIds={selectedIds}
          allSelected={allSelected}
          someSelected={someSelected}
          onEdit={handleViewCredor}
          onPageChange={handleSearch}
          onSort={handleSort}
          onPageSizeChange={setPageSize}
          onGoToPage={goToPage}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          onToggleSelectAll={toggleSelectAll}
          onToggleSelectOne={toggleSelectOne}
        />
      )}

      <CredorModal
        show={showModal}
        editingId={editingId}
        formData={formData}
        fieldErrors={fieldErrors}
        saving={saving}
        checkingDuplicate={checkingDuplicate}
        onClose={closeModal}
        onSave={() => handleSave(onSaveSuccess)}
        onFieldChange={updateField}
      />

      <SuccessModal
        show={showSuccessModal}
        message={successMessage}
        onClose={closeSuccessModal}
        onNewRegister={openModal}
      />

      <ErrorModal
        show={showErrorModal}
        message={errorMessage}
        onClose={closeErrorModal}
        onRetry={retryLastAction}
      />

      <CredorDrawer
        show={showDrawer}
        credor={selectedCredor}
        onClose={handleCloseDrawer}
        onSave={handleSaveFromDrawer}
        onDelete={handleDeleteFromDrawer}
        onToggleStatus={handleToggleStatusFromDrawer}
      />
    </div>
  );
}
