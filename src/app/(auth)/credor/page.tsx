"use client";

import { useEffect, useRef } from "react";
import { useCredorList } from "@/presentation/hooks/credor/useCredorList";
import { useCredorForm } from "@/presentation/hooks/credor/useCredorForm";
import { CredorHeader } from "@/presentation/components/Credor/CredorHeader";
import { CredorFilters } from "@/presentation/components/Credor/CredorFilters";
import { CredorTable } from "@/presentation/components/Credor/CredorTable";
import { CredorModal } from "@/presentation/components/Credor/CredorModal";

export default function CredoresPage() {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const {
    results,
    loading,
    searchData,
    pagination,
    sortField,
    sortOrder,
    setSearchData,
    handleSearch,
    clearFilters,
    handleSort,
    totalPages,
    setPageSize,
    goToPage,
  } = useCredorList();

  const {
    showModal,
    editingId,
    formData,
    fieldErrors,
    saving,
    checkingDuplicate,
    openModal,
    closeModal,
    openEditModal,
    updateField,
    handleSave,
  } = useCredorForm();

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

  return (
    <div className="flex flex-col w-full px-8 py-6">
      <CredorHeader
        totalCredores={pagination.total}
        onNewCredor={openModal}
      />

      <CredorFilters
        searchData={searchData}
        loading={loading}
        onSearchChange={setSearchData}
        onSearch={() => handleSearch(1)}
        onClear={clearFilters}
        onKeyPress={handleKeyPress}
        searchInputRef={searchInputRef}
      />

      <CredorTable
        results={results}
        loading={loading}
        pagination={pagination}
        totalPages={totalPages}
        sortField={sortField}
        sortOrder={sortOrder}
        onEdit={openEditModal}
        onPageChange={handleSearch}
        onSort={handleSort}
        onPageSizeChange={setPageSize}
        onGoToPage={goToPage}
      />

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
    </div>
  );
}
