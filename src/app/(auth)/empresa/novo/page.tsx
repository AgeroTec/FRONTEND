"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NovaEmpresaPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    codigo: "",
    nomeempresa: "",
    codgrupoempresa: "",
    nucnpj: "",
    uf: "",
    ativo: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://192.168.1.100:5103/api/v1/empresas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Erro ao salvar empresa");

      alert("Empresa cadastrada com sucesso!");
      router.push("/empresa"); // volta para a lista
    } catch (error) {
      alert("Erro ao salvar empresa: " + error);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Nova Empresa</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="border rounded p-2"
          placeholder="Código (opcional)"
          value={formData.codigo}
          onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
        />
        <input
          className="border rounded p-2"
          placeholder="Nome da Empresa"
          value={formData.nomeempresa}
          onChange={(e) => setFormData({ ...formData, nomeempresa: e.target.value })}
          required
        />
        <input
          className="border rounded p-2"
          placeholder="Nome Fantasia"
          value={formData.codgrupoempresa}
          onChange={(e) => setFormData({ ...formData, codgrupoempresa: e.target.value })}
        />
        <input
          className="border rounded p-2"
          placeholder="UF"
          value={formData.uf}
          onChange={(e) => setFormData({ ...formData, uf: e.target.value })}
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
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}
