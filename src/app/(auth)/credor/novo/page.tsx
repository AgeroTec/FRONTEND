"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { credorService } from "@/application/services/CredorService";

type FormState = {
  nome: string;
  fantasia: string;
  documento: string;
  tipoPessoa: "fisica" | "juridica";
  ativo: "S" | "N";
};

const createInitialFormState = (): FormState => ({
  nome: "",
  fantasia: "",
  documento: "",
  tipoPessoa: "juridica",
  ativo: "S",
});

export default function NovoCredorPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormState>(() => createInitialFormState());
  const [saving, setSaving] = useState(false);

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSaving(true);
    try {
      await credorService.create.execute({
        nome: formData.nome,
        fantasia: formData.fantasia || undefined,
        cnpj: formData.tipoPessoa === "juridica" ? formData.documento : undefined,
        cpf: formData.tipoPessoa === "fisica" ? formData.documento : undefined,
        ativo: formData.ativo,
      });

      alert("Credor cadastrado com sucesso!");
      router.push("/credor");
    } catch (error) {
      console.error("Erro ao salvar credor:", error);
      const message = error instanceof Error ? error.message : "Erro ao salvar credor.";
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Novo Credor</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[#111827] mb-1">
            Razão social / Nome*
          </label>
          <input
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="Digite o nome"
            value={formData.nome}
            onChange={(event) => updateField("nome", event.target.value)}
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[#111827] mb-1">
            Nome fantasia
          </label>
          <input
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="Digite o nome fantasia"
            value={formData.fantasia}
            onChange={(event) => updateField("fantasia", event.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#111827] mb-1">
            Tipo de pessoa*
          </label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={formData.tipoPessoa}
            onChange={(event) =>
              updateField("tipoPessoa", event.target.value as FormState["tipoPessoa"])
            }
          >
            <option value="juridica">Jurídica</option>
            <option value="fisica">Física</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#111827] mb-1">
            Documento*
          </label>
          <input
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder={formData.tipoPessoa === "juridica" ? "CNPJ" : "CPF"}
            value={formData.documento}
            onChange={(event) => updateField("documento", event.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#111827] mb-1">Status*</label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={formData.ativo}
            onChange={(event) => updateField("ativo", event.target.value as FormState["ativo"])}
          >
            <option value="S">Ativo</option>
            <option value="N">Desativado</option>
          </select>
        </div>

        <div className="md:col-span-2 flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={() => router.push("/credor")}
            className="px-4 py-2 rounded-md border border-gray-300 text-[#111827]"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className={`px-4 py-2 rounded-md text-white transition ${
              saving ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}
