"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { clienteService } from "@/application/services/ClienteService";
import { Cliente } from "@/domain/entities/Cliente";

export default function ClientesPage() {
  const router = useRouter();
  const [results, setResults] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState({
    codigo: "",
    razaoSocial: "",
    nomeFantasia: "",
    municipio: "",
    uf: "",
    cnpjCpf: "",
    tipo: "",
    ativo: "",
  });

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await clienteService.search.execute(searchData);
      setResults(response.items || []);

      if (response.items && response.items.length > 0) {
        toast.success(`${response.items.length} cliente(s) encontrado(s)`);
      } else {
        toast.info("Nenhum cliente encontrado");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível conectar ao servidor."
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Cadastro de Clientes</h1>
          <p className="text-lg text-gray-600">Clientes</p>
        </div>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => router.push("/cliente/novo")}
        >
          Novo
        </button>
      </div>

      {/* Parâmetros da consulta */}
      <div className="mb-6 border rounded-lg p-4 bg-gray-50">
        <h2 className="text-lg font-semibold mb-4">Parâmetros da consulta</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            placeholder="Código"
            className="border rounded p-2"
            value={searchData.codigo}
            onChange={(e) => setSearchData({ ...searchData, codigo: e.target.value })}
          />
          <input
            placeholder="Razão Social / Nome"
            className="border rounded p-2"
            value={searchData.razaoSocial}
            onChange={(e) => setSearchData({ ...searchData, razaoSocial: e.target.value })}
          />
          <input
            placeholder="Nome Fantasia"
            className="border rounded p-2"
            value={searchData.nomeFantasia}
            onChange={(e) => setSearchData({ ...searchData, nomeFantasia: e.target.value })}
          />
          <div className="flex gap-2">
            <input
              placeholder="Município"
              className="flex-1 border rounded p-2"
              value={searchData.municipio}
              onChange={(e) => setSearchData({ ...searchData, municipio: e.target.value })}
            />
            <input
              placeholder="UF"
              className="w-20 border rounded p-2"
              maxLength={2}
              value={searchData.uf}
              onChange={(e) => setSearchData({ ...searchData, uf: e.target.value.toUpperCase() })}
            />
          </div>
          <input
            placeholder="CPF / CNPJ"
            className="border rounded p-2"
            value={searchData.cnpjCpf}
            onChange={(e) => setSearchData({ ...searchData, cnpjCpf: e.target.value })}
          />
          <select
            className="border rounded p-2"
            value={searchData.tipo}
            onChange={(e) => setSearchData({ ...searchData, tipo: e.target.value })}
          >
            <option value="">Todos os tipos</option>
            <option value="cliente">Cliente</option>
            <option value="colaborador">Colaborador</option>
          </select>

          <select
            className="border rounded p-2"
            value={searchData.ativo}
            onChange={(e) => setSearchData({ ...searchData, ativo: e.target.value })}
          >
            <option value="">Todos os status</option>
            <option value="true">Ativo</option>
            <option value="false">Inativo</option>
          </select>
        </div>
        <div className="mt-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "Pesquisando..." : "Pesquisar"}
          </button>
        </div>
      </div>

      {/* Grid de resultados */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Código</th>
              <th className="border px-4 py-2 text-left">Razão Social / Nome</th>
              <th className="border px-4 py-2 text-left">Nome Fantasia</th>
              <th className="border px-4 py-2 text-left">Município / UF</th>
              <th className="border px-4 py-2 text-left">CPF / CNPJ</th>
              <th className="border px-4 py-2 text-left">Tipo</th>
              <th className="border px-4 py-2 text-left">Status</th>
              <th className="border px-4 py-2 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {results.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="border px-4 py-6 text-center text-gray-500"
                >
                  Nenhum registro encontrado
                </td>
              </tr>
            ) : (
              results.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{item.codigo || "-"}</td>
                  <td className="border px-4 py-2">{item.razaoSocial}</td>
                  <td className="border px-4 py-2">{item.nomeFantasia || "-"}</td>
                  <td className="border px-4 py-2">
                    {item.municipio || "-"} / {item.uf || "-"}
                  </td>
                  <td className="border px-4 py-2">{item.cnpj || item.cpf || "-"}</td>
                  <td className="border px-4 py-2">{item.tipo || "-"}</td>
                  <td className="border px-4 py-2">{item.ativo}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() =>
                        router.push(`/cliente/editar/${item.codigo}`)
                      }
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
