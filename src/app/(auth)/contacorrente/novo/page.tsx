"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { contaCorrenteService } from "@/application/services/ContaCorrenteService";

export default function NovaContaCorrentePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
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
    ativo: "true",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        codigo: formData.codigo ? parseInt(formData.codigo) : undefined,
        cdempresa: formData.cdempresa ? parseInt(formData.cdempresa) : undefined,
        saldoInicial: formData.saldoInicial ? parseFloat(formData.saldoInicial) : undefined,
        ativo: formData.ativo === "true" ? "S" : "N",
      };

      await contaCorrenteService.createContaCorrente.execute(payload);
      toast.success("Conta corrente cadastrada com sucesso!");
      router.push("/contacorrente");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao salvar conta corrente"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Nova Conta Corrente</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="number"
          className="border rounded p-2"
          placeholder="Código (opcional)"
          value={formData.codigo}
          onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
        />
        <input
          type="text"
          className="border rounded p-2"
          placeholder="Nome da conta"
          value={formData.nomeconta}
          onChange={(e) => setFormData({ ...formData, nomeconta: e.target.value })}
          required
        />
        <input
          type="number"
          className="border rounded p-2"
          placeholder="Código da empresa"
          value={formData.cdempresa}
          onChange={(e) => setFormData({ ...formData, cdempresa: e.target.value })}
        />
        <input
          type="text"
          className="border rounded p-2"
          placeholder="Banco"
          value={formData.banco}
          onChange={(e) => setFormData({ ...formData, banco: e.target.value })}
        />
        <input
          type="text"
          className="border rounded p-2"
          placeholder="Código do Banco"
          value={formData.codigoBanco}
          onChange={(e) => setFormData({ ...formData, codigoBanco: e.target.value })}
        />
        <input
          type="text"
          className="border rounded p-2"
          placeholder="Agência"
          value={formData.agencia}
          onChange={(e) => setFormData({ ...formData, agencia: e.target.value })}
        />
        <input
          type="text"
          className="border rounded p-2"
          placeholder="Conta"
          value={formData.conta}
          onChange={(e) => setFormData({ ...formData, conta: e.target.value })}
        />
        <input
          type="text"
          className="border rounded p-2"
          placeholder="Dígito"
          value={formData.digito}
          onChange={(e) => setFormData({ ...formData, digito: e.target.value })}
        />

        {/* Tipo de Conta */}
        <select
          className="border rounded p-2"
          value={formData.tipoConta}
          onChange={(e) => setFormData({ ...formData, tipoConta: e.target.value })}
        >
          <option value="">Selecione o tipo de conta</option>
          <option value="Corrente">Corrente</option>
          <option value="Poupança">Poupança</option>
          <option value="Aplicação">Aplicação</option>
        </select>

        <input
          type="text"
          className="border rounded p-2"
          placeholder="Titular"
          value={formData.titular}
          onChange={(e) => setFormData({ ...formData, titular: e.target.value })}
        />
        <input
          type="text"
          className="border rounded p-2"
          placeholder="CNPJ do Titular"
          value={formData.cnpjTitular}
          onChange={(e) => setFormData({ ...formData, cnpjTitular: e.target.value })}
        />

        {/* Tipo Pessoa */}
        <select
          className="border rounded p-2"
          value={formData.tipoPessoa}
          onChange={(e) => setFormData({ ...formData, tipoPessoa: e.target.value })}
        >
          <option value="">Selecione o tipo de pessoa</option>
          <option value="PJ">Pessoa Jurídica</option>
          <option value="PF">Pessoa Física</option>
        </select>

        <input
          type="number"
          className="border rounded p-2"
          placeholder="Saldo Inicial"
          value={formData.saldoInicial}
          onChange={(e) => setFormData({ ...formData, saldoInicial: e.target.value })}
        />
        <input
          type="date"
          className="border rounded p-2"
          placeholder="Data de abertura"
          value={formData.dataAbertura}
          onChange={(e) => setFormData({ ...formData, dataAbertura: e.target.value })}
        />

        <select
          className="border rounded p-2"
          value={formData.ativo}
          onChange={(e) => setFormData({ ...formData, ativo: e.target.value })}
          required
        >
          <option value="true">Ativo</option>
          <option value="false">Inativo</option>
        </select>

        {/* Botões */}
        <div className="col-span-full flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={() => router.push("/contacorrente")}
            className="px-4 py-2 rounded border"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}
