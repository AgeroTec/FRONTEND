"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NovoCredorPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    codigo: "",
    razaoSocial: "",
    nomeFantasia: "",
    municipio: "",
    uf: "",
    cnpjCpf: "",
    tipo: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://192.168.1.100:5103/api/v1/credores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Erro ao salvar credor");

      alert("Credor cadastrado com sucesso!");
      router.push("/credor"); // volta para a lista
    } catch (error) {
      alert("Erro ao salvar credor: " + error);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Novo Credor</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="border rounded p-2"
          placeholder="Código (opcional)"
          value={formData.codigo}
          onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
        />
        <input
          className="border rounded p-2"
          placeholder="Razão Social / Nome"
          value={formData.razaoSocial}
          onChange={(e) => setFormData({ ...formData, razaoSocial: e.target.value })}
          required
        />
        <input
          className="border rounded p-2"
          placeholder="Nome Fantasia"
          value={formData.nomeFantasia}
          onChange={(e) => setFormData({ ...formData, nomeFantasia: e.target.value })}
        />
        <input
          className="border rounded p-2"
          placeholder="Município"
          value={formData.municipio}
          onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
        />
        <input
          className="border rounded p-2"
          placeholder="UF"
          value={formData.uf}
          onChange={(e) => setFormData({ ...formData, uf: e.target.value })}
        />
        <input
          className="border rounded p-2"
          placeholder="CPF / CNPJ"
          value={formData.cnpjCpf}
          onChange={(e) => setFormData({ ...formData, cnpjCpf: e.target.value })}
        />
        <select
          className="border rounded p-2"
          value={formData.tipo}
          onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
          required
        >
          <option value="fornecedor">Fornecedor</option>
          <option value="colaborador">Colaborador</option>
        </select>

        <div className="col-span-full flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={() => router.push("/credor")}
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
