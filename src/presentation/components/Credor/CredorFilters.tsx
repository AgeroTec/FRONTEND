interface CredorFiltersProps {
  searchData: { search: string; ativo: string; consistencia?: string };
  loading: boolean;
  onSearchChange: (data: { search: string; ativo: string; consistencia?: string }) => void;
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
  return (
    <div className="flex gap-3 mb-6 flex-wrap">
      <label htmlFor="consistencia-filter" className="sr-only">Filtrar por consistência dos registros</label>
      <select
        id="consistencia-filter"
        className="border border-gray-300 rounded-lg px-3 py-2 text-[15px] text-[#111827] bg-white focus:outline-none focus:ring-2 focus:ring-[#0048B0] min-w-[200px]"
        value={searchData.consistencia || ""}
        onChange={(e) => onSearchChange({ ...searchData, consistencia: e.target.value })}
        aria-label="Filtrar por consistência dos registros"
      >
        <option value="">Consistência - Todos</option>
        <option value="completo">Registros completos</option>
        <option value="incompleto">Registros incompletos</option>
        <option value="somente-cnpj">Somente CNPJ</option>
        <option value="somente-cpf">Somente CPF</option>
      </select>

      <div className="flex-1 relative min-w-[300px]">
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

      <label htmlFor="status-filter" className="sr-only">Filtrar por status</label>
      <select
        id="status-filter"
        className="border border-gray-300 rounded-lg px-3 py-2 text-[15px] text-[#111827] bg-white focus:outline-none focus:ring-2 focus:ring-[#0048B0] min-w-[140px]"
        value={searchData.ativo}
        onChange={(e) => onSearchChange({ ...searchData, ativo: e.target.value })}
        aria-label="Filtrar credores por status"
      >
        <option value="">Todos</option>
        <option value="S">Ativos</option>
        <option value="N">Inativos</option>
      </select>
    </div>
  );
}
