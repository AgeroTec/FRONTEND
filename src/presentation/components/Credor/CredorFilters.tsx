interface CredorFiltersProps {
  searchData: { search: string; ativo: string };
  loading: boolean;
  onSearchChange: (data: { search: string; ativo: string }) => void;
  onSearch: () => void;
  onClear: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

export function CredorFilters({
  searchData,
  loading,
  onSearchChange,
  onSearch,
  onClear,
  onKeyPress,
  searchInputRef,
}: CredorFiltersProps) {
  const hasFilters = searchData.search || searchData.ativo !== "S";

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="flex-1 relative min-w-0">
        <label htmlFor="search-input" className="sr-only">Buscar credores</label>
        <input
          id="search-input"
          ref={searchInputRef}
          type="text"
          placeholder="Buscar por nome ou CPF/CNPJ (busca automática)"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-[15px] text-[#111827] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0048B0]"
          value={searchData.search}
          onChange={(e) => onSearchChange({ ...searchData, search: e.target.value })}
          onKeyPress={onKeyPress}
          aria-label="Buscar credores por nome ou documento"
          aria-describedby="search-hint"
        />
        <span id="search-hint" className="sr-only">
          A busca é realizada automaticamente enquanto você digita
        </span>
        {loading && (
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2"
            role="status"
            aria-label="Carregando resultados"
          >
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0048B0]"></div>
          </div>
        )}
      </div>

      <div className="flex gap-3 flex-wrap sm:flex-nowrap">
        <label htmlFor="status-filter" className="sr-only">Filtrar por status</label>
        <select
          id="status-filter"
          className="border border-gray-300 rounded-lg px-3 py-2 text-[15px] text-[#111827] bg-white focus:outline-none focus:ring-2 focus:ring-[#0048B0] w-full sm:w-auto"
          value={searchData.ativo}
          onChange={(e) => onSearchChange({ ...searchData, ativo: e.target.value })}
          aria-label="Filtrar credores por status"
        >
          <option value="">Todos</option>
          <option value="S">Ativos</option>
          <option value="N">Inativos</option>
        </select>

        {hasFilters && (
          <button
            onClick={onClear}
            className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 whitespace-nowrap"
            disabled={loading}
            aria-label="Limpar todos os filtros aplicados"
          >
            <span aria-hidden="true">✕</span> Limpar filtros
          </button>
        )}

        <button
          onClick={onSearch}
          className="bg-[#0048B0] text-white px-6 py-2 rounded-lg hover:bg-[#003c90] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          disabled={loading}
          aria-label="Realizar busca manual de credores"
        >
          {loading ? "Pesquisando..." : "Pesquisar"}
        </button>
      </div>
    </div>
  );
}
