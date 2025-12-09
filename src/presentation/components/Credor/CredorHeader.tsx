interface CredorHeaderProps {
  totalCredores: number;
  onNewCredor: () => void;
}

export function CredorHeader({ totalCredores, onNewCredor }: CredorHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#0E0E0E]">Credores</h1>
        <p className="text-sm text-gray-500 mt-1" role="status" aria-live="polite">
          {totalCredores > 0 ? `${totalCredores} credores cadastrados` : "Nenhum credor cadastrado"}
        </p>
      </div>

      <button
        onClick={onNewCredor}
        className="bg-[#0048B0] text-white px-5 py-2 rounded-lg hover:bg-[#003c90] transition-colors"
        aria-label="Cadastrar novo credor"
      >
        + Novo credor
      </button>
    </div>
  );
}
