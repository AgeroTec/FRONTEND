'use client';

import { useState } from 'react';
import { useCredores } from '@/presentation/hooks/useCredores';
import { CredorSearchBar } from '@/presentation/features/credores/components/CredorSearchBar';
import { CredoresTable } from '@/presentation/features/credores/components/CredoresTable';
import { Pagination } from '@/presentation/components/Pagination';
import { Modal } from '@/presentation/components/common/Modal';
import { CredorForm } from '@/presentation/features/credores/components/CredorForm';
import { CredorSearchParams } from '@/domain/repositories/ICredorRepository';

export default function CredoresPage() {
  const [searchParams, setSearchParams] = useState<CredorSearchParams>({
    page: 1,
    pageSize: 10,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, error } = useCredores(searchParams);

  const handleSearch = (newParams: CredorSearchParams) => {
    setSearchParams(newParams);
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ ...searchParams, page });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 text-red-700 p-4 rounded">
          Erro ao carregar credores: {error instanceof Error ? error.message : 'Erro desconhecido'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Credores</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 4v16m8-8H4" />
          </svg>
          Novo Credor
        </button>
      </div>

      <CredorSearchBar onSearch={handleSearch} isLoading={isLoading} />

      <CredoresTable credores={data?.items || []} isLoading={isLoading} />

      {data && data.total > 0 && (
        <div className="mt-6">
          <Pagination
            currentPage={data.page}
            pageSize={data.pageSize}
            totalItems={data.total}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Novo Credor"
        size="md"
      >
        <CredorForm
          onSuccess={handleCloseModal}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}
