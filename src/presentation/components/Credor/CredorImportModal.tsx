import { useEffect, useRef } from "react";

interface CredorImportModalProps {
  show: boolean;
  importing: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onClose: () => void;
  onFileImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDownloadTemplate: () => void;
}

export function CredorImportModal({
  show,
  importing,
  fileInputRef,
  onClose,
  onFileImport,
  onDownloadTemplate,
}: CredorImportModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && show && !importing) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [show, importing, onClose]);

  // Focus trap
  useEffect(() => {
    if (!show) return;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = modalRef.current?.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), label[for], [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener('keydown', handleTabKey);
    return () => window.removeEventListener('keydown', handleTabKey);
  }, [show]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-modal-title"
      aria-describedby="import-modal-description"
    >
      <div
        ref={modalRef}
        className="bg-white w-full max-w-xl rounded-lg shadow-xl p-6 animate-fadeIn max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 id="import-modal-title" className="text-xl font-semibold text-[#111827]">Importar credores</h2>
            <p id="import-modal-description" className="text-sm text-[#6B7280]">Carregue um arquivo Excel com os dados dos credores</p>
          </div>
          <button
            onClick={onClose}
            disabled={importing}
            className="text-gray-400 hover:text-gray-600 text-xl disabled:opacity-50"
            aria-label="Fechar modal de importação"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">📋 Formato do arquivo</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Formato: Excel (.xlsx ou .xls)</li>
              <li>• Colunas obrigatórias: nome, cnpj ou cpf</li>
              <li>• Colunas opcionais: fantasia</li>
            </ul>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#0048B0] transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={onFileImport}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <div className="text-4xl">📁</div>
              <div className="text-sm font-medium text-gray-700">
                Clique para selecionar o arquivo
              </div>
              <div className="text-xs text-gray-500">ou arraste e solte aqui</div>
            </label>
          </div>

          <button
            onClick={onDownloadTemplate}
            className="w-full border border-[#0048B0] text-[#0048B0] py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
            aria-label="Baixar modelo de planilha para importação"
          >
            <span aria-hidden="true">⬇️</span> Baixar modelo de planilha
          </button>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="border border-gray-300 px-4 py-2 rounded-md text-[#111827] hover:bg-gray-50 transition-colors"
            disabled={importing}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
