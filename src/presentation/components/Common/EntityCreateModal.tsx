import { ReactNode } from "react";

interface EntityCreateModalProps {
  show: boolean;
  title: string;
  description?: string;
  saving?: boolean;
  saveLabel?: string;
  onClose: () => void;
  onSave: () => void;
  children: ReactNode;
}

export function EntityCreateModal({
  show,
  title,
  description,
  saving = false,
  saveLabel = "Salvar",
  onClose,
  onSave,
  children,
}: EntityCreateModalProps) {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-xl p-6 animate-fadeIn max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-xl font-semibold !text-[#111827]">{title}</h2>
            {description && <p className="text-sm !text-[#4B5563]">{description}</p>}
          </div>
          <button
            onClick={onClose}
            disabled={saving}
            className="text-gray-400 hover:text-gray-600 text-xl disabled:opacity-50"
            aria-label="Fechar modal"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4 mt-4 !text-[#111827] [&_label]:!text-[#111827] [&_label]:font-semibold [&_input]:!text-[#111827] [&_select]:!text-[#111827] [&_textarea]:!text-[#111827] [&_span]:!text-[#111827] [&_p]:!text-[#4B5563]">
          {children}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="border border-gray-300 px-4 py-2 rounded-md text-[#111827] hover:bg-gray-50 transition-colors"
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="bg-[#0048B0] text-white px-5 py-2 rounded-md hover:bg-[#003c90] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {saving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
            {saving ? "Salvando..." : saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
