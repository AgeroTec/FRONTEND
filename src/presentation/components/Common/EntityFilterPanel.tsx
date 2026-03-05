interface EntityFilterPanelProps {
  title?: string;
  loading: boolean;
  onSearch: () => void;
  onClear: () => void;
  children: React.ReactNode;
}

export function EntityFilterPanel({
  title = "Parametros da consulta",
  loading,
  onSearch,
  onClear,
  children,
}: EntityFilterPanelProps) {
  return (
    <div className="mb-6 border border-gray-200 rounded-xl p-4 bg-white">
      <h2 className="text-lg font-semibold text-[#111827] mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{children}</div>
      <div className="mt-4 flex items-center gap-3">
        <button
          className="bg-[#0048B0] text-white px-4 py-2 rounded-lg hover:bg-[#003c90] disabled:bg-blue-300 transition-colors"
          onClick={onSearch}
          disabled={loading}
        >
          {loading ? "Pesquisando..." : "Pesquisar"}
        </button>
        <button
          className="bg-white text-[#0048B0] border border-[#0048B0]/20 px-4 py-2 rounded-lg hover:bg-[#0048B0] hover:text-white transition-colors"
          onClick={onClear}
          disabled={loading}
        >
          Limpar
        </button>
      </div>
    </div>
  );
}
