"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { clienteService } from "@/application/services/ClienteService";
import { Cliente } from "@/domain/entities/Cliente";

export default function NovoClientePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<Cliente>({
    razaoSocial: "",
    nomeFantasia: "",
    municipio: "",
    uf: "",
    cnpj: "",
    cpf: "",
    tipo: "cliente",
    ativo: "true",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await clienteService.create.execute(formData);
      toast.success("Cliente cadastrado com sucesso!");
      router.push("/cliente");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao salvar cliente"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Novo Cliente</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="border rounded p-2"
          placeholder="Razão Social / Nome *"
          value={formData.razaoSocial}
          onChange={(e) => setFormData({ ...formData, razaoSocial: e.target.value })}
          required
        />
        <input
          className="border rounded p-2"
          placeholder="Nome Fantasia"
          value={formData.nomeFantasia || ""}
          onChange={(e) => setFormData({ ...formData, nomeFantasia: e.target.value })}
        />
        <input
          className="border rounded p-2"
          placeholder="CNPJ"
          value={formData.cnpj || ""}
          onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
        />
        <input
          className="border rounded p-2"
          placeholder="CPF"
          value={formData.cpf || ""}
          onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
        />
        <input
          className="border rounded p-2"
          placeholder="Município"
          value={formData.municipio || ""}
          onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
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
          value={formData.tipo}
          onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
          required
        >
          <option value="cliente">Cliente</option>
          <option value="colaborador">Colaborador</option>
        </select>
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
            onClick={() => router.push("/cliente")}
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
