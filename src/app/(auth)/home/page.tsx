"use client";

import Link from "next/link";
import { DollarSign, Users, Building2, Landmark } from "lucide-react";

const quickLinks = [
  { title: "Credores", description: "Gerencie cadastros e status de credores.", href: "/credor", icon: DollarSign },
  { title: "Clientes", description: "Consulte e cadastre clientes.", href: "/cliente", icon: Users },
  { title: "Empresas", description: "Mantenha as empresas e dados fiscais.", href: "/empresa", icon: Building2 },
  { title: "Contas Correntes", description: "Controle bancos e contas disponíveis.", href: "/contacorrente", icon: Landmark },
];

export default function Home() {
  return (
    <div className="space-y-6">
      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <h1 className="text-2xl font-semibold text-[#111827]">Bem-vindo ao Unio Financeiro</h1>
        <p className="mt-2 text-sm text-gray-600">
          Esta é a visão inicial do sistema. Use os atalhos abaixo para acessar rapidamente os principais módulos.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {quickLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#0048B0]/40 hover:shadow-sm transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                <Icon size={18} className="text-[#0048B0]" />
              </div>
              <h2 className="text-base font-semibold text-[#111827]">{item.title}</h2>
              <p className="mt-1 text-sm text-gray-600">{item.description}</p>
              <span className="mt-4 inline-block text-sm font-medium text-[#0048B0]">Abrir módulo →</span>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
