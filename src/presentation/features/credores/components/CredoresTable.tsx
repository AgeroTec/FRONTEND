'use client';

import { Credor, CredorHelper } from '@/domain/entities/Credor';
import { StatusBadge } from '@/presentation/components/common/StatusBadge';
import { SkeletonTable } from '@/presentation/components/common/SkeletonTable';

interface CredoresTableProps {
  credores: Credor[];
  isLoading?: boolean;
}

export function CredoresTable({ credores, isLoading }: CredoresTableProps) {
  if (isLoading) {
    return <SkeletonTable rows={5} columns={4} />;
  }

  if (credores.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Nenhum credor encontrado
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nome
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Documento
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {credores.map((credor) => (
            <tr key={credor.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                {CredorHelper.getDisplayName(credor)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {CredorHelper.getDocument(credor) || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge ativo={credor.ativo} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <button className="text-blue-600 hover:text-blue-900 mr-3">
                  Editar
                </button>
                {CredorHelper.canBeDeleted(credor) && (
                  <button className="text-red-600 hover:text-red-900">
                    Excluir
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
