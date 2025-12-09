import { useEffect, useRef } from "react";

interface FieldValidation {
  isValid: boolean;
  message: string;
}

interface CredorModalProps {
  show: boolean;
  editingId: number | null;
  formData: {
    cnpj: string;
    cpf: string;
    nome: string;
    fantasia: string;
  };
  fieldErrors: {
    cnpj: FieldValidation;
    cpf: FieldValidation;
    nome: FieldValidation;
  };
  saving: boolean;
  checkingDuplicate: boolean;
  onClose: () => void;
  onSave: () => void;
  onFieldChange: (field: string, value: string) => void;
}

export function CredorModal({
  show,
  editingId,
  formData,
  fieldErrors,
  saving,
  checkingDuplicate,
  onClose,
  onSave,
  onFieldChange,
}: CredorModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && show && !saving) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [show, saving, onClose]);

  // Captura foco ao abrir o modal
  useEffect(() => {
    if (show && firstInputRef.current) {
      // Pequeno delay para garantir que o modal está renderizado
      const timer = setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [show]);

  // Trap focus dentro do modal
  useEffect(() => {
    if (!show) return;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = modalRef.current?.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
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

  const getInputClassName = (isValid: boolean, hasValue: boolean) => {
    const baseClass = "w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 transition-colors";
    if (!hasValue) return `${baseClass} border-gray-300 focus:ring-[#0048B0]`;
    if (!isValid) return `${baseClass} border-red-500 focus:ring-red-500 bg-red-50`;
    return `${baseClass} border-green-500 focus:ring-green-500 bg-green-50`;
  };

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div
        ref={modalRef}
        className="bg-white w-full max-w-2xl rounded-lg shadow-xl p-6 animate-fadeIn max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 id="modal-title" className="text-xl font-semibold text-[#111827]">
              {editingId ? "Editar credor" : "Novo credor"}
            </h2>
            <p id="modal-description" className="text-sm text-[#6B7280]">
              {editingId
                ? "Atualize as informações do credor"
                : "Preencha os dados para criar um novo credor"}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={saving}
            className="text-gray-400 hover:text-gray-600 text-xl disabled:opacity-50"
            aria-label="Fechar modal"
          >
            ×
          </button>
        </div>

        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="cnpj-input" className="text-sm font-medium text-[#111827] flex items-center gap-2">
                CNPJ
                {checkingDuplicate && formData.cnpj && (
                  <span className="text-xs text-gray-500 flex items-center gap-1" role="status" aria-live="polite">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#0048B0]"></div>
                    Verificando...
                  </span>
                )}
              </label>
              <div className="relative">
                <input
                  id="cnpj-input"
                  ref={firstInputRef}
                  type="text"
                  className={getInputClassName(fieldErrors.cnpj.isValid, formData.cnpj.length > 0)}
                  placeholder="00.000.000/0000-00"
                  value={formData.cnpj}
                  onChange={(e) => onFieldChange("cnpj", e.target.value)}
                  maxLength={18}
                  aria-invalid={!fieldErrors.cnpj.isValid}
                  aria-describedby={!fieldErrors.cnpj.isValid ? "cnpj-error" : undefined}
                />
                {formData.cnpj && fieldErrors.cnpj.isValid && !checkingDuplicate && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600">✓</span>
                )}
              </div>
              {!fieldErrors.cnpj.isValid && fieldErrors.cnpj.message && (
                <p id="cnpj-error" className="text-xs text-red-600 mt-1">{fieldErrors.cnpj.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="cpf-input" className="text-sm font-medium text-[#111827] flex items-center gap-2">
                CPF
                {checkingDuplicate && formData.cpf && (
                  <span className="text-xs text-gray-500 flex items-center gap-1" role="status" aria-live="polite">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#0048B0]"></div>
                    Verificando...
                  </span>
                )}
              </label>
              <div className="relative">
                <input
                  id="cpf-input"
                  type="text"
                  className={getInputClassName(fieldErrors.cpf.isValid, formData.cpf.length > 0)}
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={(e) => onFieldChange("cpf", e.target.value)}
                  maxLength={14}
                  aria-invalid={!fieldErrors.cpf.isValid}
                  aria-describedby={!fieldErrors.cpf.isValid ? "cpf-error" : undefined}
                />
                {formData.cpf && fieldErrors.cpf.isValid && !checkingDuplicate && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600">✓</span>
                )}
              </div>
              {!fieldErrors.cpf.isValid && fieldErrors.cpf.message && (
                <p id="cpf-error" className="text-xs text-red-600 mt-1">{fieldErrors.cpf.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="nome-input" className="text-sm font-medium text-[#111827]">Nome *</label>
            <div className="relative">
              <input
                id="nome-input"
                type="text"
                className={getInputClassName(fieldErrors.nome.isValid, formData.nome.length > 0)}
                placeholder="Digite o nome completo"
                value={formData.nome}
                onChange={(e) => onFieldChange("nome", e.target.value)}
                required
                aria-invalid={!fieldErrors.nome.isValid}
                aria-describedby={!fieldErrors.nome.isValid ? "nome-error" : undefined}
              />
              {formData.nome && fieldErrors.nome.isValid && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600">✓</span>
              )}
            </div>
            {!fieldErrors.nome.isValid && fieldErrors.nome.message && (
              <p id="nome-error" className="text-xs text-red-600 mt-1">{fieldErrors.nome.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="fantasia-input" className="text-sm font-medium text-[#111827]">Nome Fantasia</label>
            <input
              id="fantasia-input"
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0048B0]"
              placeholder="Digite o nome fantasia (opcional)"
              value={formData.fantasia}
              onChange={(e) => onFieldChange("fantasia", e.target.value)}
            />
          </div>
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
            disabled={saving || checkingDuplicate || !fieldErrors.cnpj.isValid || !fieldErrors.cpf.isValid || !fieldErrors.nome.isValid}
            className="bg-[#0048B0] text-white px-5 py-2 rounded-md hover:bg-[#003c90] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            aria-label={editingId ? "Atualizar credor" : "Salvar credor"}
          >
            {saving && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {saving ? "Salvando..." : editingId ? "Atualizar" : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
