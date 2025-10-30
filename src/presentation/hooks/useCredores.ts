import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { credorService } from '@/application/services/CredorService';
import { CredorSearchParams } from '@/domain/repositories/ICredorRepository';
import { CreateCredorDTO } from '@/application/useCases/credor/CreateCredorUseCase';
import { Credor } from '@/domain/entities/Credor';

export function useCredores(params: CredorSearchParams) {
  return useQuery({
    queryKey: ['credores', params],
    queryFn: () => credorService.search(params),
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao buscar credores');
    },
  });
}

export function useCredor(id: number) {
  return useQuery({
    queryKey: ['credor', id],
    queryFn: () => credorService.findById(id),
    enabled: !!id,
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao buscar credor');
    },
  });
}

export function useCreateCredor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCredorDTO) => credorService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credores'] });
      toast.success('Credor criado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar credor');
    },
  });
}

export function useUpdateCredor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Credor> }) =>
      credorService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credores'] });
      toast.success('Credor atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar credor');
    },
  });
}

export function useDeleteCredor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => credorService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credores'] });
      toast.success('Credor excluído com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao excluir credor');
    },
  });
}
