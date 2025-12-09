import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Credor } from "@/domain/entities/Credor";
import { formatCNPJ, formatCPF } from "@/presentation/utils/documentUtils";

type SortField = 'nome' | 'cnpj' | 'cpf' | 'ativo' | null;
type SortOrder = 'asc' | 'desc';

interface CredorTableProps {
  results: Credor[];
  loading: boolean;
  pagination: { page: number; pageSize: number; total: number };
  totalPages: number;
  sortField: SortField;
  sortOrder: SortOrder;
  onEdit: (credor: Credor) => void;
  onPageChange: (page: number) => void;
  onSort: (field: SortField) => void;
  onPageSizeChange: (size: number) => void;
  onGoToPage: (page: number) => void;
}

export function CredorTable({
  results,
  loading,
  pagination,
  totalPages,
  sortField,
  sortOrder,
  onEdit,
  onPageChange,
  onSort,
  onPageSizeChange,
  onGoToPage,
}: CredorTableProps) {
  const [selectedCredorKey, setSelectedCredorKey] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [goToPageInput, setGoToPageInput] = useState<string>('');

  // Função para gerar chave única do credor
  const getCredorKey = (credor: Credor) => credor.cnpj || credor.cpf || credor.nome;

  const selectedCredor = results.find(c => getCredorKey(c) === selectedCredorKey);

  // Calcula o range de itens sendo exibidos
  const startItem = (pagination.page - 1) * pagination.pageSize + 1;
  const endItem = Math.min(pagination.page * pagination.pageSize, pagination.total);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <span className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">⇅</span>;
    }
    return <span className="text-[#0048B0]">{sortOrder === 'asc' ? '↑' : '↓'}</span>;
  };

  useEffect(() => {
    if (!selectedCredorKey) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-actions-menu]')) {
        setSelectedCredorKey(null);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedCredorKey(null);
      }
    };

    const timerId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }, 50);

    return () => {
      clearTimeout(timerId);
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [selectedCredorKey]);

  const handleToggleStatus = async (credor: Credor) => {
    const newStatus = credor.ativo === "S" ? "N" : "S";
    const action = newStatus === "S" ? "ativar" : "inativar";

    try {
      toast.success(`Funcionalidade para ${action} será implementada em breve`);
      setSelectedCredorKey(null);
    } catch {
      toast.error(`Erro ao ${action} credor`);
    }
  };

  const handleDelete = async (credor: Credor) => {
    if (!confirm("Tem certeza que deseja excluir este credor?")) return;

    try {
      toast.success("Funcionalidade de exclusão será implementada em breve");
      setSelectedCredorKey(null);
    } catch {
      toast.error("Erro ao excluir credor");
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
        <thead className="bg-[#F9FAFB] text-[#111827] text-sm font-semibold border-b">
          <tr>
            <th className="px-6 py-3">
              <button
                onClick={() => onSort('nome')}
                className="group flex items-center gap-2 hover:text-[#0048B0] transition-colors"
                aria-label="Ordenar por nome"
              >
                Nome
                <SortIcon field="nome" />
              </button>
            </th>
            <th className="px-6 py-3">Fantasia</th>
            <th className="px-6 py-3">
              <button
                onClick={() => onSort('cnpj')}
                className="group flex items-center gap-2 hover:text-[#0048B0] transition-colors"
                aria-label="Ordenar por CNPJ"
              >
                CNPJ
                <SortIcon field="cnpj" />
              </button>
            </th>
            <th className="px-6 py-3">
              <button
                onClick={() => onSort('cpf')}
                className="group flex items-center gap-2 hover:text-[#0048B0] transition-colors"
                aria-label="Ordenar por CPF"
              >
                CPF
                <SortIcon field="cpf" />
              </button>
            </th>
            <th className="px-6 py-3">
              <button
                onClick={() => onSort('ativo')}
                className="group flex items-center gap-2 hover:text-[#0048B0] transition-colors"
                aria-label="Ordenar por status"
              >
                Status
                <SortIcon field="ativo" />
              </button>
            </th>
            <th className="px-6 py-3 text-right">Ações</th>
          </tr>
        </thead>

        <tbody className="text-[#111827] text-sm">
          {loading ? (
            <tr>
              <td colSpan={6} className="text-center py-8 text-gray-500">
                <div className="flex items-center justify-center" role="status" aria-live="polite">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0048B0]" aria-hidden="true"></div>
                  <span className="ml-3">Carregando credores...</span>
                </div>
              </td>
            </tr>
          ) : results.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-12">
                <div className="text-gray-400" role="status" aria-live="polite">
                  <p className="text-lg font-medium mb-1">Nenhum credor encontrado</p>
                  <p className="text-sm">Ajuste os filtros ou cadastre um novo credor</p>
                </div>
              </td>
            </tr>
          ) : (
            results.map((c, index) => (
              <tr key={c.codigo ?? `temp-${index}`} className="hover:bg-gray-50 border-b last:border-none transition-colors">
                <td className="px-6 py-3 font-medium">{c.nome}</td>
                <td className="px-6 py-3 text-gray-600">{c.fantasia || "-"}</td>
                <td className="px-6 py-3">{c.cnpj ? formatCNPJ(c.cnpj) : "-"}</td>
                <td className="px-6 py-3">{c.cpf ? formatCPF(c.cpf) : "-"}</td>
                <td className="px-6 py-3">
                  {c.ativo === "S" ? (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                      Ativo
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
                      Inativo
                    </span>
                  )}
                </td>
                <td className="px-6 py-3 text-right">
                  <button
                    type="button"
                    onClick={(e) => {
                      const key = getCredorKey(c);
                      e.stopPropagation();

                      if (selectedCredorKey === key) {
                        setSelectedCredorKey(null);
                        return;
                      }

                      const rect = e.currentTarget.getBoundingClientRect();
                      setMenuPosition({
                        top: rect.bottom + window.scrollY + 4,
                        left: rect.right - 192,
                      });

                      setSelectedCredorKey(key);
                    }}
                    className="text-gray-600 hover:text-[#0048B0] hover:bg-gray-100 rounded p-2 transition-colors"
                    aria-label={`Ações para ${c.nome}`}
                    aria-haspopup="menu"
                    aria-expanded={selectedCredorKey === getCredorKey(c)}
                  >
                    •••
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>

      {!loading && results.length > 0 && (
        <div className="flex flex-col gap-4 px-6 py-4 border-t border-gray-200 bg-gray-50">
          {/* Linha superior: Informações e controles */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Informações */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span role="status" aria-live="polite">
                Mostrando <span className="font-semibold text-gray-900">{startItem}-{endItem}</span> de{' '}
                <span className="font-semibold text-gray-900">{pagination.total}</span> credores
              </span>
              <span className="text-gray-400">|</span>
              <span>
                Página <span className="font-semibold text-gray-900">{pagination.page}</span> de{' '}
                <span className="font-semibold text-gray-900">{totalPages}</span>
              </span>
            </div>

            {/* Controles de itens por página */}
            <div className="flex items-center gap-2">
              <label htmlFor="page-size" className="text-sm text-gray-600">
                Itens por página:
              </label>
              <select
                id="page-size"
                value={pagination.pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0048B0] transition-colors"
                aria-label="Selecionar número de itens por página"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>

          {/* Linha inferior: Navegação de páginas */}
          {totalPages > 1 && (
            <nav aria-label="Paginação" className="flex flex-wrap items-center justify-between gap-4">
              {/* Botões de navegação esquerda */}
              <div className="flex gap-2">
                <button
                  onClick={() => onPageChange(1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Primeira página"
                  title="Primeira página"
                >
                  ««
                </button>
                <button
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Página anterior"
                >
                  Anterior
                </button>
              </div>

              {/* Números de página */}
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
                        onClick={() => onPageChange(pageNum)}
                        className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                          pagination.page === pageNum
                            ? "bg-[#0048B0] text-white border-[#0048B0]"
                            : "border-gray-300 hover:bg-white"
                        }`}
                        aria-label={`Página ${pageNum}`}
                        aria-current={pagination.page === pageNum ? "page" : undefined}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                {/* Input para ir para página específica */}
                <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-300">
                  <label htmlFor="goto-page" className="text-sm text-gray-600">
                    Ir para:
                  </label>
                  <input
                    id="goto-page"
                    type="number"
                    min="1"
                    max={totalPages}
                    value={goToPageInput}
                    onChange={(e) => setGoToPageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const page = parseInt(goToPageInput);
                        if (page) {
                          onGoToPage(page);
                          setGoToPageInput('');
                        }
                      }
                    }}
                    placeholder={pagination.page.toString()}
                    className="w-16 border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#0048B0] transition-colors"
                    aria-label="Número da página"
                  />
                  <button
                    onClick={() => {
                      const page = parseInt(goToPageInput);
                      if (page) {
                        onGoToPage(page);
                        setGoToPageInput('');
                      }
                    }}
                    disabled={!goToPageInput || parseInt(goToPageInput) < 1 || parseInt(goToPageInput) > totalPages}
                    className="px-3 py-1.5 bg-[#0048B0] text-white rounded-lg text-sm hover:bg-[#003c90] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Ir para página"
                  >
                    Ir
                  </button>
                </div>
              </div>

              {/* Botões de navegação direita */}
              <div className="flex gap-2">
                <button
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={pagination.page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Próxima página"
                >
                  Próxima
                </button>
                <button
                  onClick={() => onPageChange(totalPages)}
                  disabled={pagination.page === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Última página"
                  title="Última página"
                >
                  »»
                </button>
              </div>
            </nav>
          )}
        </div>
      )}

      {selectedCredorKey && selectedCredor && (
        <div
          data-actions-menu
          role="menu"
          aria-label="Ações do credor"
          className="fixed w-48 bg-white rounded-lg shadow-xl border border-gray-200"
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
            zIndex: 9999,
          }}
        >
          <button
            type="button"
            role="menuitem"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(selectedCredor);
              setSelectedCredorKey(null);
            }}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 flex items-center gap-2 rounded-t-lg transition-colors border-b border-gray-100"
            aria-label="Editar credor"
          >
            <span aria-hidden="true">✏️</span> Editar
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleStatus(selectedCredor);
              setSelectedCredorKey(null);
            }}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 flex items-center gap-2 transition-colors border-b border-gray-100"
            aria-label={selectedCredor.ativo === "S" ? "Inativar credor" : "Ativar credor"}
          >
            <span aria-hidden="true">{selectedCredor.ativo === "S" ? "🔴" : "🟢"}</span>
            {selectedCredor.ativo === "S" ? "Inativar" : "Ativar"}
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(selectedCredor);
              setSelectedCredorKey(null);
            }}
            className="w-full text-left px-4 py-3 hover:bg-red-50 text-sm text-red-600 flex items-center gap-2 rounded-b-lg transition-colors"
            aria-label="Excluir credor"
          >
            <span aria-hidden="true">🗑️</span> Excluir
          </button>
        </div>
      )}
    </div>
  );
}
