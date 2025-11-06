"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { empresaService } from "@/application/services/EmpresaService";
import { Empresa } from "@/domain/entities/Empresa";

export default function NovaEmpresaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<Empresa>({
    nomeempresa: "",
    nomefantasia: "",
    codgrupoempresa: "",
    nucnpj: "",
    uf: "",
    ativo: "ativo",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await empresaService.create.execute(formData);
      alert("Empresa cadastrada com sucesso!");
      router.push("/empresa");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Erro ao salvar empresa"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Nova Empresa</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="border rounded p-2"
          placeholder="Nome da Empresa *"
          value={formData.nomeempresa}
          onChange={(e) => setFormData({ ...formData, nomeempresa: e.target.value })}
          required
        />
        <input
          className="border rounded p-2"
          placeholder="Nome Fantasia"
          value={formData.nomefantasia || ""}
          onChange={(e) => setFormData({ ...formData, nomefantasia: e.target.value })}
        />
        <input
          className="border rounded p-2"
          placeholder="CNPJ"
          value={formData.nucnpj || ""}
          onChange={(e) => setFormData({ ...formData, nucnpj: e.target.value })}
        />
        <input
          className="border rounded p-2"
          placeholder="Código do Grupo"
          value={formData.codgrupoempresa || ""}
          onChange={(e) => setFormData({ ...formData, codgrupoempresa: e.target.value })}
        />
        <input
          className="border rounded p-2"
          placeholder="UF"
          maxLength={2}
          value={formData.uf || ""}
          onChange={(e) => setFormData({ ...formData, uf: e.target.value.toUpperCase() })}
        />
        <select
          className="border rounded p-2"
          value={formData.ativo}
          onChange={(e) => setFormData({ ...formData, ativo: e.target.value })}
          required
        >
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
        </select>

        <div className="col-span-full flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={() => router.push("/empresa")}
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
