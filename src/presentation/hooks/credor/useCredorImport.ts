import { useState, useRef } from "react";
import { toast } from "sonner";

interface UseCredorImportReturn {
  showImportModal: boolean;
  importing: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  openImportModal: () => void;
  closeImportModal: () => void;
  handleFileImport: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  downloadTemplate: () => void;
}

export function useCredorImport(): UseCredorImportReturn {
  const [showImportModal, setShowImportModal] = useState(false);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openImportModal = () => setShowImportModal(true);
  const closeImportModal = () => setShowImportModal(false);

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error("Formato inválido. Use apenas arquivos Excel (.xlsx ou .xls)");
      return;
    }

    setImporting(true);
    try {
      toast.info("Funcionalidade de importação será implementada em breve");
      closeImportModal();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch {
      toast.error("Erro ao importar arquivo. Tente novamente.");
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    toast.info("Download do template será implementado em breve");
  };

  return {
    showImportModal,
    importing,
    fileInputRef,
    openImportModal,
    closeImportModal,
    handleFileImport,
    downloadTemplate,
  };
}
