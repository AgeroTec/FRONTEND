"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { empresaService } from "@/application/services/EmpresaService";
import { Empresa } from "@/domain/entities/Empresa";

export default function EmpresaPage() {
  const router = useRouter();
  const [results, setResults] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState({
    codigo: "",
    nomeempresa: "",
    codgrupoempresa: "",
    nucnpj: "",
    uf: "",
    ativo: "",
  });

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await empresaService.search.execute(searchData);
      setResults(response.items || []);
    } catch (error) {
      console.error("Erro ao buscar empresas:", error);
      alert(
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
          <h1 className="text-2xl font-bold">Cadastro de Empresas</h1>
          <p className="text-lg text-gray-600">Empresas</p>
        </div>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => router.push("/empresa/novo")}
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
            placeholder="Empresa"
            className="border rounded p-2"
            value={searchData.nomeempresa}
            onChange={(e) => setSearchData({ ...searchData, nomeempresa: e.target.value })}
          />
          <input
            placeholder="Codigo do Grupo"
            className="border rounded p-2"
            value={searchData.codgrupoempresa}
            onChange={(e) => setSearchData({ ...searchData, codgrupoempresa: e.target.value })}
          />
          <div className="flex gap-2">
            <input
              placeholder="CNPJ"
              className="flex-1 border rounded p-2"
              value={searchData.nucnpj}
              onChange={(e) => setSearchData({ ...searchData, nucnpj: e.target.value })}
            />
            <input
              placeholder="UF"
              className="w-20 border rounded p-2"
              value={searchData.uf}
              onChange={(e) => setSearchData({ ...searchData, uf: e.target.value })}
            />
          </div>
          <select
            className="border rounded p-2"
            value={searchData.ativo}
            onChange={(e) => setSearchData({ ...searchData, ativo: e.target.value })}
          >
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
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
              <th className="border px-4 py-2 text-left">Nome da Empresa</th>
              <th className="border px-4 py-2 text-left">Código do Grupo</th>
              <th className="border px-4 py-2 text-left">UF</th>
              <th className="border px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {results.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="border px-4 py-6 text-center text-gray-500"
                >
                  Nenhum registro encontrado
                </td>
              </tr>
            ) : (
              results.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{item.codigo || "-"}</td>
                  <td className="border px-4 py-2">{item.nomeempresa}</td>
                  <td className="border px-4 py-2">{item.codgrupoempresa}</td>
                  <td className="border px-4 py-2">{item.uf}</td>
                  <td className="border px-4 py-2">{item.ativo}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() =>
                        router.push(`/empresa/editar/${item.codigo}`)
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
