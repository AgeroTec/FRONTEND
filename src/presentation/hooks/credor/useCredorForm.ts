import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Credor } from "@/domain/entities/Credor";
import { credorService } from "@/application/services/CredorService";
import { formatCNPJ, formatCPF, removeMask, validateCNPJ, validateCPF } from "@/presentation/utils/documentUtils";

interface FormData {
  cnpj: string;
  cpf: string;
  nome: string;
  fantasia: string;
}

interface FieldValidation {
  isValid: boolean;
  message: string;
}

interface FieldErrors {
  cnpj: FieldValidation;
  cpf: FieldValidation;
  nome: FieldValidation;
}

interface UseCredorFormReturn {
  showModal: boolean;
  editingId: number | null;
  formData: FormData;
  fieldErrors: FieldErrors;
  saving: boolean;
  checkingDuplicate: boolean;
  showSuccessModal: boolean;
  showErrorModal: boolean;
  successMessage: string;
  errorMessage: string;
  openModal: () => void;
  closeModal: () => void;
  openEditModal: (credor: Credor) => void;
  updateField: (field: string, value: string) => void;
  handleSave: (onSuccess: () => void) => Promise<void>;
  closeSuccessModal: () => void;
  closeErrorModal: () => void;
  retryLastAction: () => Promise<void>;
}

export function useCredorForm(): UseCredorFormReturn {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState<FormData>({
    cnpj: "",
    cpf: "",
    nome: "",
    fantasia: "",
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({
    cnpj: { isValid: true, message: "" },
    cpf: { isValid: true, message: "" },
    nome: { isValid: true, message: "" },
  });

  const duplicateCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const requestCounterRef = useRef(0);
  const lastActionRef = useRef<(() => Promise<void>) | null>(null);

  const checkDuplicate = async (document: string, type: 'cnpj' | 'cpf') => {
    if (duplicateCheckTimeoutRef.current) {
      clearTimeout(duplicateCheckTimeoutRef.current);
    }

    duplicateCheckTimeoutRef.current = setTimeout(async () => {
      // Increment counter for this request
      requestCounterRef.current += 1;
      const currentRequest = requestCounterRef.current;

      setCheckingDuplicate(true);
      try {
        const cleanDoc = removeMask(document);
        const result = await credorService.search.execute({
          doc: cleanDoc,
          page: 1,
          pageSize: 100,
        });

        // Only update state if this is still the latest request
        if (currentRequest !== requestCounterRef.current) {
          return; // Ignore outdated response
        }

        const duplicate = result.items.find(item => {
          const itemDoc = type === 'cnpj' ? item.cnpj : item.cpf;
          return itemDoc === cleanDoc && item.codigo !== editingId;
        });

        if (duplicate) {
          setFieldErrors((prev) => ({
            ...prev,
            [type]: {
              isValid: false,
              message: `${type === 'cnpj' ? 'CNPJ' : 'CPF'} já cadastrado: ${duplicate.nome}`,
            },
          }));
        } else {
          setFieldErrors((prev) => ({
            ...prev,
            [type]: {
              isValid: true,
              message: "",
            },
          }));
        }
      } catch {
        // Silently fail
      } finally {
        // Only update loading state if this is still the latest request
        if (currentRequest === requestCounterRef.current) {
          setCheckingDuplicate(false);
        }
      }
    }, 800);
  };

  const openModal = () => {
    setShowModal(true);
    setEditingId(null);
    setFormData({ cnpj: "", cpf: "", nome: "", fantasia: "" });
    setFieldErrors({
      cnpj: { isValid: true, message: "" },
      cpf: { isValid: true, message: "" },
      nome: { isValid: true, message: "" },
    });
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    if (duplicateCheckTimeoutRef.current) {
      clearTimeout(duplicateCheckTimeoutRef.current);
    }
  };

  const openEditModal = (credor: Credor) => {
    setEditingId(credor.codigo || null);
    setFormData({
      cnpj: credor.cnpj ? formatCNPJ(credor.cnpj) : "",
      cpf: credor.cpf ? formatCPF(credor.cpf) : "",
      nome: credor.nome,
      fantasia: credor.fantasia || "",
    });
    setFieldErrors({
      cnpj: { isValid: true, message: "" },
      cpf: { isValid: true, message: "" },
      nome: { isValid: true, message: "" },
    });
    setShowModal(true);
  };

  const updateField = (field: string, value: string) => {
    if (field === 'cnpj') {
      const formatted = formatCNPJ(value);
      const cleanValue = removeMask(formatted);

      setFormData((prev) => ({ ...prev, cnpj: formatted, cpf: "" }));

      if (cleanValue.length === 14) {
        const isValid = validateCNPJ(formatted);
        setFieldErrors((prev) => ({
          ...prev,
          cnpj: {
            isValid,
            message: isValid ? "" : "CNPJ inválido",
          },
          cpf: { isValid: true, message: "" },
        }));

        if (isValid) {
          checkDuplicate(formatted, 'cnpj');
        }
      } else {
        setFieldErrors((prev) => ({
          ...prev,
          cnpj: { isValid: true, message: "" },
        }));
      }
    } else if (field === 'cpf') {
      const formatted = formatCPF(value);
      const cleanValue = removeMask(formatted);

      setFormData((prev) => ({ ...prev, cpf: formatted, cnpj: "" }));

      if (cleanValue.length === 11) {
        const isValid = validateCPF(formatted);
        setFieldErrors((prev) => ({
          ...prev,
          cpf: {
            isValid,
            message: isValid ? "" : "CPF inválido",
          },
          cnpj: { isValid: true, message: "" },
        }));

        if (isValid) {
          checkDuplicate(formatted, 'cpf');
        }
      } else {
        setFieldErrors((prev) => ({
          ...prev,
          cpf: { isValid: true, message: "" },
        }));
      }
    } else if (field === 'nome') {
      setFormData((prev) => ({ ...prev, [field]: value }));

      if (value.trim().length > 0) {
        setFieldErrors((prev) => ({
          ...prev,
          nome: { isValid: true, message: "" },
        }));
      } else {
        setFieldErrors((prev) => ({
          ...prev,
          nome: { isValid: false, message: "Nome é obrigatório" },
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const validateForm = (): boolean => {
    const errors: FieldErrors = {
      cnpj: { isValid: true, message: "" },
      cpf: { isValid: true, message: "" },
      nome: { isValid: true, message: "" },
    };

    let isValid = true;

    if (!formData.nome.trim()) {
      errors.nome = { isValid: false, message: "Nome é obrigatório" };
      isValid = false;
    }

    if (!formData.cnpj && !formData.cpf) {
      toast.error("CNPJ ou CPF é obrigatório");
      isValid = false;
    }

    if (formData.cnpj && !validateCNPJ(formData.cnpj)) {
      errors.cnpj = { isValid: false, message: "CNPJ inválido" };
      isValid = false;
    }

    if (formData.cpf && !validateCPF(formData.cpf)) {
      errors.cpf = { isValid: false, message: "CPF inválido" };
      isValid = false;
    }

    if (!fieldErrors.cnpj.isValid || !fieldErrors.cpf.isValid) {
      toast.error("Corrija os erros antes de salvar");
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSave = async (onSuccess: () => void) => {
    if (!validateForm()) return;

    lastActionRef.current = async () => {
      await handleSave(onSuccess);
    };

    setSaving(true);
    try {
      const payload = {
        nome: formData.nome.trim(),
        fantasia: formData.fantasia.trim() || undefined,
        cnpj: formData.cnpj ? removeMask(formData.cnpj) : undefined,
        cpf: formData.cpf ? removeMask(formData.cpf) : undefined,
      };

      if (editingId) {
        await credorService.update.execute(editingId, { ...payload, ativo: 'S' });
        setSuccessMessage("Credor atualizado com sucesso!");
      } else {
        await credorService.create.execute({ ...payload, ativo: 'S' });
        setSuccessMessage("Credor cadastrado com sucesso!");
      }

      closeModal();
      setFormData({ cnpj: "", cpf: "", nome: "", fantasia: "" });
      setShowSuccessModal(true);
      onSuccess();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao salvar credor.";
      setErrorMessage(message);
      setShowErrorModal(true);
    } finally {
      setSaving(false);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setSuccessMessage("");
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  const retryLastAction = async () => {
    if (lastActionRef.current) {
      await lastActionRef.current();
    }
  };

  useEffect(() => {
    return () => {
      if (duplicateCheckTimeoutRef.current) {
        clearTimeout(duplicateCheckTimeoutRef.current);
      }
    };
  }, []);

  return {
    showModal,
    editingId,
    formData,
    fieldErrors,
    saving,
    checkingDuplicate,
    showSuccessModal,
    showErrorModal,
    successMessage,
    errorMessage,
    openModal,
    closeModal,
    openEditModal,
    updateField,
    handleSave,
    closeSuccessModal,
    closeErrorModal,
    retryLastAction,
  };
}
