import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown, MoreHorizontal } from "lucide-react";

type SortOrder = "asc" | "desc";

export interface EntityTableColumn<T> {
  id: string;
  header: string;
  sortable?: boolean;
  sortValue?: (item: T) => string | number;
  render: (item: T) => React.ReactNode;
}

interface EntityDataTableProps<T> {
  items: T[];
  loading: boolean;
  hasSearched: boolean;
  columns: EntityTableColumn<T>[];
  getItemId: (item: T, index: number) => number | string;
  pagination: { page: number; pageSize: number; total: number };
  totalPages: number;
  onPageSizeChange: (size: number) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onPageChange?: (page: number) => void;
  onGoToPage?: (page: number) => void;
  onEdit?: (item: T) => void;
  emptySearchedText?: string;
  emptyInitialText?: string;
}

export function EntityDataTable<T>({
  items,
  loading,
  hasSearched,
  columns,
  getItemId,
  pagination,
  totalPages,
  onPageSizeChange,
  onPreviousPage,
  onNextPage,
  onPageChange,
  onGoToPage,
  onEdit,
  emptySearchedText = "Nenhum registro encontrado",
  emptyInitialText = "Use os filtros para pesquisar",
}: EntityDataTableProps<T>) {
  const [sortColumnId, setSortColumnId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [openMenuId, setOpenMenuId] = useState<number | string | null>(null);
  const [goToPageInput, setGoToPageInput] = useState<string>("");

  const sortedItems = useMemo(() => {
    if (!sortColumnId) return items;

    const column = columns.find((c) => c.id === sortColumnId);
    if (!column?.sortValue) return items;

    return [...items].sort((a, b) => {
      const av = column.sortValue!(a);
      const bv = column.sortValue!(b);
      if (av < bv) return sortOrder === "asc" ? -1 : 1;
      if (av > bv) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [columns, items, sortColumnId, sortOrder]);

  const startItem = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.pageSize + 1;
  const endItem = Math.min(pagination.page * pagination.pageSize, pagination.total);

  const handleSort = (columnId: string) => {
    if (sortColumnId === columnId) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortColumnId(columnId);
    setSortOrder("asc");
  };

  const renderSort = (columnId: string) => {
    if (sortColumnId !== columnId) {
      return <ChevronsUpDown size={14} className="text-gray-400" aria-hidden="true" />;
    }

    if (sortOrder === "asc") {
      return <ChevronUp size={14} className="text-[#0048B0]" aria-hidden="true" />;
    }

    return <ChevronDown size={14} className="text-[#0048B0]" aria-hidden="true" />;
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
          <thead className="bg-[#F9FAFB] text-[#111827] text-sm font-semibold border-b-2 border-gray-300">
            <tr>
              {columns.map((column) => (
                <th key={column.id} className="px-4 py-3 text-left">
                  {column.sortable ? (
                    <button className="inline-flex items-center gap-2 hover:text-[#0048B0] transition-colors" onClick={() => handleSort(column.id)}>
                      {column.header} {renderSort(column.id)}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
              {onEdit && <th className="px-4 py-3 text-right">Ações</th>}
            </tr>
          </thead>
          <tbody className="text-[#111827] text-sm">
            {loading ? (
              <tr>
                <td colSpan={columns.length + (onEdit ? 1 : 0)} className="px-4 py-8 text-center text-gray-500">
                  <div className="flex items-center justify-center" role="status" aria-live="polite">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0048B0]" aria-hidden="true"></div>
                    <span className="ml-3">Carregando registros...</span>
                  </div>
                </td>
              </tr>
            ) : sortedItems.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onEdit ? 1 : 0)} className="text-center py-12">
                  <div className="text-gray-400" role="status" aria-live="polite">
                    <p className="text-lg font-medium mb-1">{hasSearched ? emptySearchedText : emptyInitialText}</p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedItems.map((item, index) => {
                const itemId = getItemId(item, index);
                return (
                  <tr key={itemId} className="bg-gray-50 border-b border-gray-200 last:border-none hover:bg-gray-100 transition-colors">
                    {columns.map((column) => (
                      <td key={`${itemId}-${column.id}`} className="px-4 py-3">
                        {column.render(item)}
                      </td>
                    ))}
                    {onEdit && (
                      <td className="px-4 py-3 text-right">
                        <div className="relative">
                          <button
                            className="inline-flex items-center justify-center p-2 rounded hover:bg-gray-100 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId((prev) => (prev === itemId ? null : itemId));
                            }}
                          >
                            <MoreHorizontal size={16} />
                          </button>
                          {openMenuId === itemId && (
                            <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-xl z-10">
                              <button
                                className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors"
                                onClick={() => {
                                  setOpenMenuId(null);
                                  onEdit(item);
                                }}
                              >
                                Editar
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        </div>
      </div>

      {!loading && sortedItems.length > 0 && (
        <div className="flex flex-col gap-4 px-6 py-4 border-t border-gray-200 bg-gray-50 !text-gray-900">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-sm !text-gray-900">
              <span role="status" aria-live="polite">
                Mostrando <span className="font-semibold text-[#0048B0]">{startItem}-{endItem}</span> de{" "}
                <span className="font-semibold text-[#0048B0]">{pagination.total}</span> registros
              </span>
              <span className="text-gray-400">|</span>
              <span>
                Página <span className="font-semibold text-[#0048B0]">{pagination.page}</span> de{" "}
                <span className="font-semibold text-[#0048B0]">{totalPages}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="page-size-generic" className="text-sm !text-gray-900 font-semibold">
                Itens por página:
              </label>
              <select
                id="page-size-generic"
                value={pagination.pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0048B0] transition-colors"
                disabled={loading}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          {totalPages > 1 && (
            <nav aria-label="Paginação" className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => (onPageChange ? onPageChange(1) : onPreviousPage())}
                  disabled={pagination.page === 1}
                  className="px-3 py-2 bg-[#0048B0] text-white rounded-lg text-sm hover:bg-[#003c90] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Primeira página"
                >
                  {"<<"}
                </button>
                <button
                  onClick={onPreviousPage}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 bg-[#0048B0] text-white rounded-lg text-sm hover:bg-[#003c90] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() =>
                          onPageChange ? onPageChange(pageNum) : pageNum > pagination.page ? onNextPage() : onPreviousPage()
                        }
                        className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                          pagination.page === pageNum
                            ? "bg-[#0048B0] text-white"
                            : "bg-[#0048B0]/10 text-[#0048B0] hover:bg-[#0048B0]/20"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-300">
                  <label htmlFor="goto-page-generic" className="text-sm !text-gray-900 font-semibold">
                    Ir para:
                  </label>
                  <input
                    id="goto-page-generic"
                    type="number"
                    min="1"
                    max={totalPages}
                    value={goToPageInput}
                    onChange={(e) => setGoToPageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const page = parseInt(goToPageInput);
                        if (page) {
                          if (onGoToPage) onGoToPage(page);
                          else if (onPageChange) onPageChange(page);
                          setGoToPageInput("");
                        }
                      }
                    }}
                    placeholder={pagination.page.toString()}
                    className="w-16 border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#0048B0] transition-colors"
                  />
                  <button
                    onClick={() => {
                      const page = parseInt(goToPageInput);
                      if (page) {
                        if (onGoToPage) onGoToPage(page);
                        else if (onPageChange) onPageChange(page);
                        setGoToPageInput("");
                      }
                    }}
                    disabled={!goToPageInput || parseInt(goToPageInput) < 1 || parseInt(goToPageInput) > totalPages}
                    className="px-3 py-1.5 bg-[#0048B0] text-white rounded-lg text-sm hover:bg-[#003c90] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Ir
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={onNextPage}
                  disabled={pagination.page === totalPages}
                  className="px-4 py-2 bg-[#0048B0] text-white rounded-lg text-sm hover:bg-[#003c90] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Próxima
                </button>
                <button
                  onClick={() => (onPageChange ? onPageChange(totalPages) : onNextPage())}
                  disabled={pagination.page === totalPages}
                  className="px-3 py-2 bg-[#0048B0] text-white rounded-lg text-sm hover:bg-[#003c90] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Última página"
                >
                  {">>"}
                </button>
              </div>
            </nav>
          )}
        </div>
      )}
    </>
  );
}
