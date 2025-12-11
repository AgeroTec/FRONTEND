import { useEffect, useRef, useState } from "react";
import { Credor } from "@/domain/entities/Credor";
import { formatCNPJ, formatCPF, removeMask, validateCNPJ, validateCPF } from "@/presentation/utils/documentUtils";

interface CredorDrawerProps {
  show: boolean;
  credor: Credor | null;
  onClose: () => void;
  onSave?: (id: number, data: Partial<Credor>) => Promise<void>;
  onDelete?: (credor: Credor) => void;
  onToggleStatus?: (credor: Credor) => void;
}

export function CredorDrawer({ show, credor, onClose, onSave, onDelete, onToggleStatus }: CredorDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'identificacao' | 'fiscal'>('identificacao');
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Partial<Credor>>({});
  const [saving, setSaving] = useState(false);
  const [documentType, setDocumentType] = useState<'cnpj' | 'cpf'>('cnpj');

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && show) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [show, onClose]);

  // Bloquear scroll do body quando drawer estiver aberto
  useEffect(() => {
    if (show) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [show]);

  // Reset tab and editing state when drawer closes
  useEffect(() => {
    if (!show) {
      setActiveTab('identificacao');
      setIsEditing(false);
      setEditedData({});
    }
  }, [show]);

  // Initialize edited data when credor changes
  useEffect(() => {
    if (credor) {
      const docType = credor.cnpj ? 'cnpj' : 'cpf';
      setDocumentType(docType);
      setEditedData({
        nome: credor.nome,
        fantasia: credor.fantasia || '',
        cnpj: credor.cnpj || '',
        cpf: credor.cpf || '',
        tipoPessoa: credor.tipoPessoa || (credor.cnpj ? 'juridica' : 'fisica'),
        tipoCredor: credor.tipoCredor || 'corretor',
        microempresa: credor.microempresa || false,
        transportadora: credor.transportadora || false,
        estrangeiro: credor.estrangeiro || false,
      });
    }
  }, [credor]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset changes
      const docType = credor?.cnpj ? 'cnpj' : 'cpf';
      setDocumentType(docType);
      setEditedData({
        nome: credor?.nome,
        fantasia: credor?.fantasia || '',
        cnpj: credor?.cnpj || '',
        cpf: credor?.cpf || '',
        tipoPessoa: credor?.tipoPessoa || (credor?.cnpj ? 'juridica' : 'fisica'),
        tipoCredor: credor?.tipoCredor || 'corretor',
        microempresa: credor?.microempresa || false,
        transportadora: credor?.transportadora || false,
        estrangeiro: credor?.estrangeiro || false,
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    if (!credor?.codigo || !onSave) return;

    setSaving(true);
    try {
      await onSave(credor.codigo, editedData);
      setIsEditing(false);
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (field: keyof Credor, value: string | boolean) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDocumentChange = (value: string) => {
    const cleanValue = removeMask(value);

    if (cleanValue.length <= 11) {
      // CPF
      const formatted = formatCPF(value);
      setDocumentType('cpf');
      setEditedData(prev => ({
        ...prev,
        cpf: removeMask(formatted),
        cnpj: '',
        tipoPessoa: 'fisica',
      }));
    } else {
      // CNPJ
      const formatted = formatCNPJ(value);
      setDocumentType('cnpj');
      setEditedData(prev => ({
        ...prev,
        cnpj: removeMask(formatted),
        cpf: '',
        tipoPessoa: 'juridica',
      }));
    }
  };

  const handleTipoPessoaChange = (tipo: 'fisica' | 'juridica') => {
    if (tipo === 'fisica') {
      setDocumentType('cpf');
      setEditedData(prev => ({
        ...prev,
        tipoPessoa: 'fisica',
        cnpj: '',
      }));
    } else {
      setDocumentType('cnpj');
      setEditedData(prev => ({
        ...prev,
        tipoPessoa: 'juridica',
        cpf: '',
      }));
    }
  };

  if (!show || !credor) return null;

  const tipoPessoa = credor.cnpj ? 'Jurídica' : 'Física';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className="fixed right-0 top-0 h-full w-[540px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto"
        style={{
          transform: show ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 id="drawer-title" className="text-xl font-semibold text-[#111827]">
                Dados do Credor
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Visualize e edite as informações do credor.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Fechar drawer"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-0 rounded-lg overflow-hidden border border-gray-300">
            <button
              type="button"
              onClick={() => setActiveTab('identificacao')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-all ${
                activeTab === 'identificacao'
                  ? 'text-[#111827] bg-white'
                  : 'text-gray-500 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Identificação
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('fiscal')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-all ${
                activeTab === 'fiscal'
                  ? 'text-[#111827] bg-white'
                  : 'text-gray-500 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Fiscal
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {activeTab === 'identificacao' && (
            <div className="space-y-6">
              {/* Card de Identificação */}
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-base font-semibold text-[#111827]">Identificação</h3>
                  <div className="flex gap-2">
                    {onToggleStatus && (
                      <button
                        type="button"
                        onClick={() => onToggleStatus(credor)}
                        className={`p-2 rounded-md transition-colors ${
                          credor.ativo === "S"
                            ? "bg-yellow-50 hover:bg-yellow-100 text-yellow-600"
                            : "bg-green-50 hover:bg-green-100 text-green-600"
                        }`}
                        aria-label={credor.ativo === "S" ? "Desativar credor" : "Ativar credor"}
                        title={credor.ativo === "S" ? "Desativar" : "Ativar"}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {credor.ativo === "S" ? (
                            <>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 3l18 18"
                              />
                            </>
                          ) : (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          )}
                        </svg>
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(credor)}
                        className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                        aria-label="Excluir"
                        title="Excluir"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                    {onSave && (
                      <>
                        {isEditing ? (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={handleEditToggle}
                              disabled={saving}
                              className="p-2 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
                              aria-label="Cancelar edição"
                              title="Cancelar"
                            >
                              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={handleSave}
                              disabled={saving}
                              className="p-2 bg-[#0048B0] hover:bg-[#003c90] text-white rounded-md transition-colors disabled:opacity-50 flex items-center gap-1"
                              aria-label="Salvar alterações"
                              title="Salvar"
                            >
                              {saving ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={handleEditToggle}
                            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                            aria-label="Editar"
                            title="Editar"
                          >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Código */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código
                    </label>
                    <div className="text-base text-gray-900 px-3 py-2">
                      {credor.codigo || "-"}
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <div className="text-base px-3 py-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        credor.ativo === "S"
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {credor.ativo === "S" ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </div>

                  {/* Tipo de pessoa */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de pessoa
                    </label>
                    {isEditing ? (
                      <select
                        value={editedData.tipoPessoa || (credor.cnpj ? 'juridica' : 'fisica')}
                        onChange={(e) => handleTipoPessoaChange(e.target.value as 'fisica' | 'juridica')}
                        className="w-full text-base text-gray-900 bg-white px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0048B0]"
                        disabled={saving}
                        aria-label="Tipo de pessoa"
                      >
                        <option value="fisica">Física</option>
                        <option value="juridica">Jurídica</option>
                      </select>
                    ) : (
                      <div className="text-base text-gray-900 px-3 py-2">
                        {tipoPessoa}
                      </div>
                    )}
                  </div>

                  {/* Tipo de credor */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de credor
                    </label>
                    {isEditing ? (
                      <select
                        value={editedData.tipoCredor || 'corretor'}
                        onChange={(e) => handleFieldChange('tipoCredor', e.target.value)}
                        className="w-full text-base text-gray-900 bg-white px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0048B0]"
                        disabled={saving}
                        aria-label="Tipo de credor"
                      >
                        <option value="corretor">Corretor</option>
                        <option value="fornecedor">Fornecedor</option>
                        <option value="prestador">Prestador de Serviços</option>
                        <option value="cliente">Cliente</option>
                        <option value="parceiro">Parceiro</option>
                      </select>
                    ) : (
                      <div className="text-base text-gray-900 px-3 py-2">
                        {credor.tipoCredor === 'corretor' ? 'Corretor' :
                         credor.tipoCredor === 'fornecedor' ? 'Fornecedor' :
                         credor.tipoCredor === 'prestador' ? 'Prestador de Serviços' :
                         credor.tipoCredor === 'cliente' ? 'Cliente' :
                         credor.tipoCredor === 'parceiro' ? 'Parceiro' : 'Corretor'}
                      </div>
                    )}
                  </div>

                  {/* CNPJ/CPF */}
                  <div className="col-span-2">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        CNPJ/CPF
                      </label>
                      {isEditing && (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setDocumentType('cpf');
                              setEditedData(prev => ({ ...prev, cnpj: '', cpf: '' }));
                            }}
                            className={`text-xs px-2 py-1 rounded transition-colors ${
                              documentType === 'cpf'
                                ? 'bg-[#0048B0] text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                            disabled={saving}
                          >
                            CPF
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDocumentType('cnpj');
                              setEditedData(prev => ({ ...prev, cnpj: '', cpf: '' }));
                            }}
                            className={`text-xs px-2 py-1 rounded transition-colors ${
                              documentType === 'cnpj'
                                ? 'bg-[#0048B0] text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                            disabled={saving}
                          >
                            CNPJ
                          </button>
                        </div>
                      )}
                    </div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={documentType === 'cnpj'
                          ? formatCNPJ(editedData.cnpj || '')
                          : formatCPF(editedData.cpf || '')
                        }
                        onChange={(e) => handleDocumentChange(e.target.value)}
                        placeholder={documentType === 'cnpj' ? '00.000.000/0000-00' : '000.000.000-00'}
                        maxLength={documentType === 'cnpj' ? 18 : 14}
                        className="w-full text-base text-gray-900 bg-white px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0048B0]"
                        disabled={saving}
                      />
                    ) : (
                      <div className="text-base text-gray-900 px-3 py-2">
                        {credor.cnpj ? formatCNPJ(credor.cnpj) : credor.cpf ? formatCPF(credor.cpf) : '-'}
                      </div>
                    )}
                  </div>

                  {/* Razão Social/Nome */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Razão Social/Nome
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.nome || ''}
                        onChange={(e) => handleFieldChange('nome', e.target.value)}
                        placeholder="Digite a razão social ou nome"
                        className="w-full text-base text-gray-900 bg-white px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0048B0]"
                        disabled={saving}
                      />
                    ) : (
                      <div className="text-base text-gray-900 px-3 py-2">
                        {credor.nome}
                      </div>
                    )}
                  </div>

                  {/* Fantasia */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fantasia
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.fantasia || ''}
                        onChange={(e) => handleFieldChange('fantasia', e.target.value)}
                        placeholder="Digite o nome fantasia"
                        className="w-full text-base text-gray-900 bg-white px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0048B0]"
                        disabled={saving}
                      />
                    ) : (
                      <div className="text-base text-gray-900 px-3 py-2">
                        {credor.fantasia || '-'}
                      </div>
                    )}
                  </div>

                  {/* Checkboxes */}
                  <div className="col-span-2 space-y-3 pt-2">
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isEditing ? (editedData.microempresa || false) : (credor.microempresa || false)}
                        onChange={(e) => isEditing && handleFieldChange('microempresa', e.target.checked)}
                        disabled={!isEditing || saving}
                        className="w-4 h-4 rounded border-gray-300 text-[#0048B0] focus:ring-[#0048B0] disabled:opacity-50 cursor-pointer"
                      />
                      Microempresa
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isEditing ? (editedData.transportadora || false) : (credor.transportadora || false)}
                        onChange={(e) => isEditing && handleFieldChange('transportadora', e.target.checked)}
                        disabled={!isEditing || saving}
                        className="w-4 h-4 rounded border-gray-300 text-[#0048B0] focus:ring-[#0048B0] disabled:opacity-50 cursor-pointer"
                      />
                      Transportadora
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isEditing ? (editedData.estrangeiro || false) : (credor.estrangeiro || false)}
                        onChange={(e) => isEditing && handleFieldChange('estrangeiro', e.target.checked)}
                        disabled={!isEditing || saving}
                        className="w-4 h-4 rounded border-gray-300 text-[#0048B0] focus:ring-[#0048B0] disabled:opacity-50 cursor-pointer"
                      />
                      Estrangeiro
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fiscal' && (
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-base font-semibold text-[#111827] mb-6">Informações Fiscais</h3>
                <p className="text-sm text-gray-500">Conteúdo da aba Fiscal em desenvolvimento.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
