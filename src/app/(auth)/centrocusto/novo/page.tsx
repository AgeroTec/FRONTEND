"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { centroCustoService } from "@/application/services/CentroCustoService";
import { CentroCusto } from "@/domain/entities/CentroCusto";

export default function NovoCentroDeCustoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<CentroCusto>({
    nomecentrocusto: "",
    nomeempresa: "",
    ativo: "true",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await centroCustoService.create.execute(formData);
      alert("Centro de Custos cadastrado com sucesso!");
      router.push("/centrocusto");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Erro ao salvar centro de custo"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Novo Centro de Custos</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="border rounded p-2"
          placeholder="Nome do Centro de Custo *"
          value={formData.nomecentrocusto}
          onChange={(e) => setFormData({ ...formData, nomecentrocusto: e.target.value })}
          required
        />
        <input
          className="border rounded p-2"
          placeholder="Nome da Empresa"
          value={formData.nomeempresa || ""}
          onChange={(e) => setFormData({ ...formData, nomeempresa: e.target.value })}
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

        <div className="col-span-full flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={() => router.push("/centrocusto")}
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
