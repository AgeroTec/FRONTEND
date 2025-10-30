import { CredorHelper } from '@/domain/entities/Credor';

interface StatusBadgeProps {
  ativo: string;
}

export function StatusBadge({ ativo }: StatusBadgeProps) {
  const isActive = ativo === 'S';
  const label = isActive ? 'Ativo' : 'Inativo';
  const badgeClass = isActive
    ? 'bg-green-100 text-green-800'
    : 'bg-red-100 text-red-800';

  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${badgeClass}`}>
      {label}
    </span>
  );
}
