import { useEffect, useRef } from "react";

interface ErrorModalProps {
  show: boolean;
  message: string;
  onClose: () => void;
  onRetry?: () => void;
}

export function ErrorModal({ show, message, onClose, onRetry }: ErrorModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const retryButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && show) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [show, onClose]);

  // Captura foco ao abrir o modal
  useEffect(() => {
    if (show && retryButtonRef.current) {
      const timer = setTimeout(() => {
        retryButtonRef.current?.focus();
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
        'button:not([disabled])'
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
      aria-labelledby="error-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white w-full max-w-md rounded-lg shadow-xl p-6 animate-fadeIn"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h2 id="error-modal-title" className="text-xl font-semibold text-[#111827] mb-2">
            Erro
          </h2>
          <p className="text-gray-600 mb-6">{message}</p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              aria-label="Fechar modal de erro"
            >
              Fechar
            </button>
            {onRetry && (
              <button
                ref={retryButtonRef}
                onClick={() => {
                  onClose();
                  onRetry();
                }}
                className="flex-1 bg-[#0048B0] text-white px-4 py-2 rounded-lg hover:bg-[#003c90] transition-colors"
                aria-label="Tentar novamente"
              >
                Tentar novamente
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
