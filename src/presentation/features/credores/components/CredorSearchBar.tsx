'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { credorSearchSchema } from '@/domain/schemas/credorSchemas';
import { z } from 'zod';

type SearchFormData = z.infer<typeof credorSearchSchema>;

interface CredorSearchBarProps {
  onSearch: (data: SearchFormData) => void;
  isLoading?: boolean;
}

export function CredorSearchBar({ onSearch, isLoading }: CredorSearchBarProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<SearchFormData>({
    resolver: zodResolver(credorSearchSchema),
    defaultValues: {
      page: 1,
      pageSize: 10,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSearch)} className="flex gap-4 mb-6">
      <input
        {...register('search')}
        placeholder="Buscar por nome..."
        className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        {...register('doc')}
        placeholder="CPF/CNPJ"
        className="w-48 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <select
        {...register('ativo')}
        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Todos</option>
        <option value="S">Ativos</option>
        <option value="N">Inativos</option>
      </select>

      <button
        type="submit"
        disabled={isLoading}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Buscando...' : 'Buscar'}
      </button>

      {errors.doc && (
        <span className="text-red-500 text-sm self-center">{errors.doc.message}</span>
      )}
    </form>
  );
}
