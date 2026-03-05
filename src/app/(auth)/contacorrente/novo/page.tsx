"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { contaCorrenteService } from "@/infrastructure/di/services";

type FormState = {
  codigo: string;
  nomeconta: string;
  cdempresa: string;
  banco: string;
  codigoBanco: string;
  agencia: string;
  conta: string;
  digito: string;
  tipoConta: string;
  titular: string;
  cnpjTitular: string;
  tipoPessoa: string;
  saldoInicial: string;
  dataAbertura: string;
  ativo: string;
};

const INITIAL_STATE: FormState = {
  codigo: "",
  nomeconta: "",
  cdempresa: "",
  banco: "",
  codigoBanco: "",
  agencia: "",
  conta: "",
  digito: "",
  tipoConta: "",
  titular: "",
  cnpjTitular: "",
  tipoPessoa: "",
  saldoInicial: "",
  dataAbertura: "",
  ativo: "S",
};

export default function NovaContaCorrentePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormState>(INITIAL_STATE);

  const updateField = (field: keyof FormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const onlyNumbers = (value: string) => value.replace(/\D/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nomeconta.trim()) {
      toast.error("Nome da conta e obrigatorio");
      return;
    }
    if (!formData.banco.trim() || !formData.agencia.trim() || !formData.conta.trim()) {
      toast.error("Banco, agencia e conta sao obrigatorios");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        codigo: formData.codigo ? Number(formData.codigo) : undefined,
        nomeconta: formData.nomeconta.trim(),
        cdempresa: formData.cdempresa ? Number(formData.cdempresa) : undefined,
        banco: formData.banco.trim() || undefined,
        codigoBanco: formData.codigoBanco.trim() || undefined,
        agencia: formData.agencia.trim() || undefined,
        conta: formData.conta.trim() || undefined,
        digito: formData.digito.trim() || undefined,
        tipoConta: formData.tipoConta || undefined,
        titular: formData.titular.trim() || undefined,
        cnpjTitular: onlyNumbers(formData.cnpjTitular) || undefined,
        tipoPessoa: formData.tipoPessoa || undefined,
        saldoInicial: formData.saldoInicial ? Number(formData.saldoInicial) : undefined,
        dataAbertura: formData.dataAbertura || undefined,
        ativo: formData.ativo,
      };

      await contaCorrenteService.createContaCorrente.execute(payload);
      toast.success("Conta corrente cadastrada com sucesso!");
      router.push("/contacorrente");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao salvar conta corrente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#0E0E0E]">Nova Conta Corrente</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">Nome da conta *</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[15px] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0048B0]"
              placeholder="Ex.: Conta Operacional"
              value={formData.nomeconta}
              onChange={(e) => updateField("nomeconta", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">Codigo da empresa</label>
            <input
              type="text"
              inputMode="numeric"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[15px] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0048B0]"
              placeholder="Ex.: 10"
              value={formData.cdempresa}
              onChange={(e) => updateField("cdempresa", onlyNumbers(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">Status</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[15px] text-[#111827] bg-white focus:outline-none focus:ring-2 focus:ring-[#0048B0]"
              value={formData.ativo}
              onChange={(e) => updateField("ativo", e.target.value)}
            >
              <option value="S">Ativo</option>
              <option value="N">Inativo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">Banco *</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[15px] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0048B0]"
              placeholder="Ex.: Banco do Brasil"
              value={formData.banco}
              onChange={(e) => updateField("banco", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">Codigo do banco</label>
            <input
              type="text"
              inputMode="numeric"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[15px] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0048B0]"
              placeholder="Ex.: 001"
              value={formData.codigoBanco}
              onChange={(e) => updateField("codigoBanco", onlyNumbers(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">Tipo de conta</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[15px] text-[#111827] bg-white focus:outline-none focus:ring-2 focus:ring-[#0048B0]"
              value={formData.tipoConta}
              onChange={(e) => updateField("tipoConta", e.target.value)}
            >
              <option value="">Selecione</option>
              <option value="Corrente">Corrente</option>
              <option value="Poupanca">Poupanca</option>
              <option value="Aplicacao">Aplicacao</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">Agencia *</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[15px] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0048B0]"
              value={formData.agencia}
              onChange={(e) => updateField("agencia", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">Conta *</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[15px] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0048B0]"
              value={formData.conta}
              onChange={(e) => updateField("conta", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">Digito</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[15px] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0048B0]"
              value={formData.digito}
              onChange={(e) => updateField("digito", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">Titular</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[15px] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0048B0]"
              value={formData.titular}
              onChange={(e) => updateField("titular", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">CNPJ do titular</label>
            <input
              type="text"
              inputMode="numeric"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[15px] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0048B0]"
              value={formData.cnpjTitular}
              onChange={(e) => updateField("cnpjTitular", onlyNumbers(e.target.value))}
              maxLength={14}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">Tipo de pessoa</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[15px] text-[#111827] bg-white focus:outline-none focus:ring-2 focus:ring-[#0048B0]"
              value={formData.tipoPessoa}
              onChange={(e) => updateField("tipoPessoa", e.target.value)}
            >
              <option value="">Selecione</option>
              <option value="PJ">Pessoa Juridica</option>
              <option value="PF">Pessoa Fisica</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">Saldo inicial</label>
            <input
              type="number"
              step="0.01"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[15px] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0048B0]"
              value={formData.saldoInicial}
              onChange={(e) => updateField("saldoInicial", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">Data de abertura</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[15px] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0048B0]"
              value={formData.dataAbertura}
              onChange={(e) => updateField("dataAbertura", e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/contacorrente")}
            className="bg-white text-[#0048B0] border border-[#0048B0]/20 px-5 py-2 rounded-lg hover:bg-[#0048B0] hover:text-white transition-colors"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-[#0048B0] text-white px-5 py-2 rounded-lg hover:bg-[#003c90] transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}
