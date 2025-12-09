"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { contaCorrenteService } from "@/application/services/ContaCorrenteService";
import { ContaCorrente } from "@/domain/entities/ContaCorrente";

export default function ContasCorrentesPage() {
  const router = useRouter();
  const [results, setResults] = useState<ContaCorrente[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState({
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
    ativo: "",
  });

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await contaCorrenteService.searchContasCorrentes.execute(searchData);
      setResults(response.items || []);

      if (response.items && response.items.length > 0) {
        toast.success(`${response.items.length} conta(s) encontrada(s)`);
      } else {
        toast.info("Nenhuma conta corrente encontrada");
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
          <h1 className="text-2xl font-bold">Cadastro de Contas Correntes</h1>
          <p className="text-lg text-gray-600">Contas Bancárias das Empresas</p>
        </div>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => router.push("/contacorrente/novo")}
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
            placeholder="Nome da Conta"
            className="border rounded p-2"
            value={searchData.nomeconta}
            onChange={(e) => setSearchData({ ...searchData, nomeconta: e.target.value })}
          />
          <input
            placeholder="Código da Empresa"
            className="border rounded p-2"
            value={searchData.cdempresa}
            onChange={(e) => setSearchData({ ...searchData, cdempresa: e.target.value })}
          />
          <input
            placeholder="Banco"
            className="border rounded p-2"
            value={searchData.banco}
            onChange={(e) => setSearchData({ ...searchData, banco: e.target.value })}
          />
          <input
            placeholder="Código do Banco"
            className="border rounded p-2"
            value={searchData.codigoBanco}
            onChange={(e) => setSearchData({ ...searchData, codigoBanco: e.target.value })}
          />
          <div className="flex gap-2">
            <input
              placeholder="Agência"
              className="flex-1 border rounded p-2"
              value={searchData.agencia}
              onChange={(e) => setSearchData({ ...searchData, agencia: e.target.value })}
            />
            <input
              placeholder="Conta"
              className="flex-1 border rounded p-2"
              value={searchData.conta}
              onChange={(e) => setSearchData({ ...searchData, conta: e.target.value })}
            />
            <input
              placeholder="Dígito"
              className="w-20 border rounded p-2"
              value={searchData.digito}
              onChange={(e) => setSearchData({ ...searchData, digito: e.target.value })}
            />
          </div>
          <select
            className="border rounded p-2"
            value={searchData.tipoConta}
            onChange={(e) => setSearchData({ ...searchData, tipoConta: e.target.value })}
          >
            <option value="">Tipo de Conta</option>
            <option value="Corrente">Corrente</option>
            <option value="Aplicacao">Aplicação</option>
            <option value="Poupanca">Poupança</option>
          </select>
          <input
            placeholder="Titular"
            className="border rounded p-2"
            value={searchData.titular}
            onChange={(e) => setSearchData({ ...searchData, titular: e.target.value })}
          />
          <input
            placeholder="CNPJ do Titular"
            className="border rounded p-2"
            value={searchData.cnpjTitular}
            onChange={(e) => setSearchData({ ...searchData, cnpjTitular: e.target.value })}
          />
          <select
            className="border rounded p-2"
            value={searchData.tipoPessoa}
            onChange={(e) => setSearchData({ ...searchData, tipoPessoa: e.target.value })}
          >
            <option value="">Tipo de Pessoa</option>
            <option value="PJ">Pessoa Jurídica</option>
            <option value="PF">Pessoa Física</option>
          </select>
          <input
            placeholder="Saldo Inicial"
            type="number"
            className="border rounded p-2"
            value={searchData.saldoInicial}
            onChange={(e) => setSearchData({ ...searchData, saldoInicial: e.target.value })}
          />
          <input
            placeholder="Data de Abertura"
            type="date"
            className="border rounded p-2"
            value={searchData.dataAbertura}
            onChange={(e) => setSearchData({ ...searchData, dataAbertura: e.target.value })}
          />
          <select
            className="border rounded p-2"
            value={searchData.ativo}
            onChange={(e) => setSearchData({ ...searchData, ativo: e.target.value })}
          >
            <option value="">Status</option>
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
              <th className="border px-4 py-2 text-left">Nome da Conta</th>
              <th className="border px-4 py-2 text-left">Banco</th>
              <th className="border px-4 py-2 text-left">Agência / Conta</th>
              <th className="border px-4 py-2 text-left">Titular</th>
              <th className="border px-4 py-2 text-left">CNPJ</th>
              <th className="border px-4 py-2 text-left">Tipo</th>
              <th className="border px-4 py-2 text-left">Status</th>
              <th className="border px-4 py-2 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {results.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="border px-4 py-6 text-center text-gray-500"
                >
                  Nenhum registro encontrado
                </td>
              </tr>
            ) : (
              results.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{item.codigo || "-"}</td>
                  <td className="border px-4 py-2">{item.nomeconta}</td>
                  <td className="border px-4 py-2">{item.banco}</td>
                  <td className="border px-4 py-2">
                    {item.agencia} / {item.conta}-{item.digito}
                  </td>
                  <td className="border px-4 py-2">{item.titular}</td>
                  <td className="border px-4 py-2">{item.cnpjTitular}</td>
                  <td className="border px-4 py-2">{item.tipoConta}</td>
                  <td className="border px-4 py-2">
                    {item.ativo ? "Ativo" : "Inativo"}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() =>
                        router.push(`/contascorrentes/editar/${item.codigo}`)
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
