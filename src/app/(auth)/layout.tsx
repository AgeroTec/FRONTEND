"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/presentation/stores/authStore";
import { tenantService } from "@/infrastructure/di/services";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  CircleHelp,
  FilePlus,
  FileStackIcon,
  HardHat,
  Home,
  LifeBuoy,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  Store,
} from "lucide-react";

const ROUTES_TO_PREFETCH = [
  "/home",
  "/novo",
  "/configuracoes",
  "/usuarios",
  "/perfil",
  "/credor",
  "/titulos-receber",
  "/parcelas-receber",
  "/titulos-pagar",
  "/parcelas-pagar",
  "/saldos",
  "/movimentacoes",
  "/emissao-nfe",
  "/emissao-nfse",
  "/recepcao-nfe",
  "/recepcao-nfse",
  "/emissao-cte",
  "/custos-unitarios",
  "/orcamento",
  "/cliente",
  "/centrocusto",
  "/contacorrente",
  "/empresa",
  "/suporte",
];

type SearchItem = { label: string; href: string; keywords: string[] };

const FEATURE_SEARCH_ITEMS: SearchItem[] = [
  { label: "Home", href: "/home", keywords: ["inicio", "dashboard"] },
  { label: "Novo", href: "/novo", keywords: ["novo", "cadastro"] },
  { label: "Configurações", href: "/configuracoes", keywords: ["config", "parametros"] },
  { label: "Usuários", href: "/usuarios", keywords: ["usuario", "acesso"] },
  { label: "Perfil", href: "/perfil", keywords: ["perfil", "conta"] },
  { label: "Credores", href: "/credor", keywords: ["credor", "fornecedor"] },
  { label: "Títulos a Receber", href: "/titulos-receber", keywords: ["receber", "titulos"] },
  { label: "Parcelas a Receber", href: "/parcelas-receber", keywords: ["parcelas", "receber"] },
  { label: "Títulos a Pagar", href: "/titulos-pagar", keywords: ["pagar", "titulos"] },
  { label: "Parcelas a Pagar", href: "/parcelas-pagar", keywords: ["parcelas", "pagar"] },
  { label: "Saldos", href: "/saldos", keywords: ["saldo", "caixa", "banco"] },
  { label: "Movimentações", href: "/movimentacoes", keywords: ["movimentacao", "extrato"] },
  { label: "Emissão NF-e", href: "/emissao-nfe", keywords: ["nfe", "nota fiscal"] },
  { label: "Emissão NFS-e", href: "/emissao-nfse", keywords: ["nfse", "nota fiscal"] },
  { label: "Recepção NF-e", href: "/recepcao-nfe", keywords: ["recepcao", "nfe"] },
  { label: "Recepção NFS-e", href: "/recepcao-nfse", keywords: ["recepcao", "nfse"] },
  { label: "Emissão CT-e", href: "/emissao-cte", keywords: ["cte", "transporte"] },
  { label: "Custos Unitários", href: "/custos-unitarios", keywords: ["custos", "engenharia"] },
  { label: "Orçamento", href: "/orcamento", keywords: ["orcamento", "engenharia"] },
  { label: "Clientes", href: "/cliente", keywords: ["cliente"] },
  { label: "Centro de Custos", href: "/centrocusto", keywords: ["centro", "custos"] },
  { label: "Contas Correntes", href: "/contacorrente", keywords: ["conta", "corrente", "banco"] },
  { label: "Empresas", href: "/empresa", keywords: ["empresa"] },
  { label: "Suporte", href: "/suporte", keywords: ["ajuda", "suporte"] },
];

type TreeItem = { href: string; text: string; children?: { href: string; text: string }[] };

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const defaultCompanyName = process.env.NEXT_PUBLIC_COMPANY_NAME?.trim() || "Empresa";

  const [isAuth, setIsAuth] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [relatorioOpen, setRelatorioOpen] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [companyName, setCompanyName] = useState(defaultCompanyName);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const isRouteActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  const hasActiveRouteInTree = (items: TreeItem[]) => {
    return items.some((item) => {
      if (item.children?.length) {
        return item.children.some((child) => isRouteActive(child.href));
      }
      return item.href !== "#" && isRouteActive(item.href);
    });
  };

  useEffect(() => {
    const authenticated = checkAuth();
    if (!authenticated) {
      router.replace(`/login?returnTo=${encodeURIComponent(pathname || "/home")}`);
    } else {
      setIsAuth(true);
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setMobileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [checkAuth, pathname, router]);

  useEffect(() => {
    const savedDesktopState = window.localStorage.getItem("sidebar:desktopOpen");
    if (savedDesktopState !== null) {
      setDesktopOpen(savedDesktopState === "true");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("sidebar:desktopOpen", String(desktopOpen));
  }, [desktopOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    setSearchOpen(false);
    setSearchQuery("");
  }, [pathname]);

  useEffect(() => {
    ROUTES_TO_PREFETCH.forEach((route) => router.prefetch(route));
  }, [router]);

  useEffect(() => {
    let active = true;
    if (!isAuth) return () => void 0;

    void tenantService.getCurrent
      .execute()
      .then((tenant) => {
        if (!active) return;
        const name = tenant.primaryCompanyName?.trim() || tenant.displayName?.trim();
        if (name) {
          setCompanyName(name);
        }
      })
      .catch(() => {
        if (active) {
          setCompanyName(defaultCompanyName);
        }
      });

    return () => {
      active = false;
    };
  }, [defaultCompanyName, isAuth]);

  const toggleRelatorio = (key: string, defaultOpen = false) => {
    setRelatorioOpen((prev) => {
      const current = prev[key];
      const effectiveState = current ?? defaultOpen;
      return { ...prev, [key]: !effectiveState };
    });
  };

  const navBase = "text-gray-700 hover:bg-gray-100";
  const navActive = "bg-blue-900 text-white hover:bg-blue-900";

  const renderOptionalLink = (href: string, text: string, isActive: boolean) => {
    if (href.startsWith("#")) {
      return <span className="block px-3 py-2 rounded-md text-gray-500 text-xs">{text}</span>;
    }

    return (
      <Link
        href={href}
        className={`block px-3 py-2 rounded-md transition-colors text-xs ${isActive ? navActive : navBase}`}
        onClick={() => setMobileOpen(false)}
      >
        {text}
      </Link>
    );
  };

  const renderNavItem = (href: string, icon: React.ReactNode, text: string, isActive?: boolean) => (
    <Link
      href={href}
      title={!desktopOpen && !mobileOpen ? text : undefined}
      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${!desktopOpen && !mobileOpen ? "justify-center" : ""} ${
        isActive ? navActive : navBase
      }`}
      onClick={() => setMobileOpen(false)}
    >
      {icon}
      {(desktopOpen || mobileOpen) && <span className="text-xs font-medium">{text}</span>}
    </Link>
  );

  const renderCollapsibleItem = (key: string, icon: React.ReactNode, text: string, subitems: TreeItem[]) => {
    const isSectionActive = hasActiveRouteInTree(subitems);
    const isOpen = relatorioOpen[key] ?? isSectionActive;

    return (
      <>
        <button
          onClick={() => toggleRelatorio(key, isSectionActive)}
          title={!desktopOpen && !mobileOpen ? text : undefined}
          className={`flex items-center justify-between gap-3 px-3 py-2 w-full rounded-md transition-colors ${
            !desktopOpen && !mobileOpen ? "justify-center" : ""
          } ${isSectionActive ? "bg-blue-50 text-blue-900" : navBase}`}
        >
          <div className="flex items-center gap-3">
            {icon}
            {(desktopOpen || mobileOpen) && <span className="text-xs font-medium">{text}</span>}
          </div>
          {(desktopOpen || mobileOpen) && (isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
        </button>

        {(desktopOpen || mobileOpen) && isOpen && (
          <div className="pl-8 flex flex-col space-y-1">
            {subitems.map((subitem, index) => (
              <div key={index}>
                {subitem.children ? (
                  <SubTree
                    parentKey={key}
                    subitem={subitem}
                    relatorioOpen={relatorioOpen}
                    isRouteActive={isRouteActive}
                    toggleRelatorio={toggleRelatorio}
                    renderOptionalLink={renderOptionalLink}
                  />
                ) : (
                  renderOptionalLink(subitem.href, subitem.text, isRouteActive(subitem.href))
                )}
              </div>
            ))}
          </div>
        )}
      </>
    );
  };

  if (!isAuth) return null;

  const userInitial = (user?.nome?.trim()?.charAt(0) || "U").toUpperCase();
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredFeatures = normalizedQuery
    ? FEATURE_SEARCH_ITEMS.filter((item) => {
        if (item.label.toLowerCase().includes(normalizedQuery)) return true;
        return item.keywords.some((keyword) => keyword.toLowerCase().includes(normalizedQuery));
      }).slice(0, 8)
    : FEATURE_SEARCH_ITEMS.slice(0, 8);

  const navigateToFeature = (href: string) => {
    setSearchOpen(false);
    setSearchQuery("");
    router.push(href);
  };

  return (
    <div className="flex h-screen">
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          aria-label="Fechar menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-md transform transition-transform duration-300 z-50 md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="px-6 py-4 text-left">
            <img src="/Unio Plataforma.png" alt="Unio Plataforma" className="h-10 w-auto object-contain" />
          </div>

          <nav className="flex-1 px-2 space-y-2 overflow-y-auto">
            {renderNavItem("/home", <Home size={18} />, "Home", pathname === "/home")}

            <div className="border-t border-gray-200 my-2" />

            <div className="text-gray-400 text-xs px-3 uppercase">Módulos</div>
            {renderCollapsibleItem("financeiro", <CircleDollarSign size={18} />, "Financeiro", [
              {
                href: "#",
                text: "Contas a Receber",
                children: [
                  { href: "/titulos-receber", text: "Títulos a receber" },
                  { href: "/parcelas-receber", text: "Consulta de parcelas" },
                ],
              },
              {
                href: "#",
                text: "Contas a Pagar",
                children: [
                  { href: "/titulos-pagar", text: "Títulos a pagar" },
                  { href: "/parcelas-pagar", text: "Consulta de parcelas" },
                ],
              },
            ])}
            {renderCollapsibleItem("notasfiscais", <FileStackIcon size={18} />, "Notas Fiscais", [
              { href: "/emissao-nfe", text: "Emissão de NF-e" },
              { href: "/emissao-nfse", text: "Emissão de NFS-e" },
              { href: "/recepcao-nfe", text: "Recepção de NF-e" },
              { href: "/recepcao-nfse", text: "Recepção de NFS-e" },
            ])}
            {renderCollapsibleItem("engenharia", <HardHat size={18} />, "Engenharia", [
              { href: "/custos-unitarios", text: "Custos Unitários" },
              { href: "/orcamento", text: "Orçamento" },
            ])}

            <div className="border-t border-gray-200 my-2" />

            <div className="text-gray-400 text-xs px-3 uppercase">Outros Módulos</div>
            {renderCollapsibleItem("suporteoperacional", <FilePlus size={18} />, "Suporte Operacional", [
              { href: "/credor", text: "Credores" },
              { href: "/cliente", text: "Clientes" },
              { href: "/centrocusto", text: "Centro de Custos" },
              { href: "/contacorrente", text: "Contas Correntes" },
              { href: "/empresa", text: "Empresas" },
            ])}
          </nav>

          <div className="px-3 py-4 mt-auto flex flex-col gap-2 border-t border-gray-200">
            {renderNavItem("/suporte", <LifeBuoy size={18} />, "Suporte", pathname === "/suporte")}
            {renderNavItem("/configuracoes", <Settings size={18} />, "Configurações", pathname === "/configuracoes")}
            <button
              onClick={async () => {
                await logout();
                router.push("/login");
              }}
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 text-red-600"
            >
              <LogOut size={18} />
              <span className="text-xs font-medium">Sair</span>
            </button>
          </div>
        </div>
      </aside>

      <aside
        className={`hidden md:flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300 ${
          desktopOpen ? "w-[248px]" : "w-[72px]"
        }`}
      >
        <div className={`flex items-center py-4 ${desktopOpen ? "justify-between px-4" : "justify-center px-2"}`}>
          {desktopOpen && <img src="/Unio Plataforma.png" alt="Unio Plataforma" className="h-10 w-auto object-contain" />}
          <button
            onClick={() => setDesktopOpen((prev) => !prev)}
            className={`${desktopOpen ? "w-7 h-7" : "w-full h-8"} rounded-md border border-gray-200 hover:bg-gray-100 flex items-center justify-center`}
            aria-label={desktopOpen ? "Recolher menu" : "Expandir menu"}
          >
            {desktopOpen ? <PanelLeftClose size={16} className="text-blue-900" /> : <PanelLeftOpen size={16} className="text-blue-900" />}
          </button>
        </div>

        {desktopOpen && (
          <div className="px-4">
            <div className="flex items-center gap-2 px-1 py-2">
              <div className="w-7 h-7 rounded-full bg-blue-900 text-white text-[10px] font-semibold flex items-center justify-center">{userInitial}</div>
              <div className="min-w-0">
                <div className="text-[10px] font-semibold text-gray-800 truncate">{user?.nome || "Usuário"}</div>
                <div className="text-[10px] text-gray-500 truncate">{user?.email || user?.login || ""}</div>
              </div>
              <button
                onClick={async () => {
                  await logout();
                  router.push("/login");
                }}
                className="ml-auto w-7 h-7 rounded-md border border-transparent hover:border-gray-200 hover:bg-gray-100 flex items-center justify-center"
                aria-label="Sair"
              >
                <LogOut size={14} className="text-blue-900" />
              </button>
            </div>
            <div className="my-3 h-px bg-gray-300" />
          </div>
        )}

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {renderNavItem("/home", <Home size={18} />, "Home", pathname === "/home")}

          {desktopOpen && <div className="my-3 h-px bg-gray-300" />}
          {desktopOpen && <div className="text-[11px] px-3 font-bold tracking-[0.8px] text-gray-500 uppercase">Módulos</div>}

          {renderCollapsibleItem("financeiro", <CircleDollarSign size={18} />, "Financeiro", [
            {
              href: "#",
              text: "Contas a Receber",
              children: [
                { href: "/titulos-receber", text: "Títulos a receber" },
                { href: "/parcelas-receber", text: "Consulta de parcelas" },
              ],
            },
            {
              href: "#",
              text: "Contas a Pagar",
              children: [
                { href: "/titulos-pagar", text: "Títulos a pagar" },
                { href: "/parcelas-pagar", text: "Consulta de parcelas" },
              ],
            },
            {
              href: "#",
              text: "Caixa e Bancos",
              children: [
                { href: "/saldos", text: "Saldos" },
                { href: "/movimentacoes", text: "Movimentações" },
              ],
            },
          ])}

          {renderCollapsibleItem("notasfiscais", <FileStackIcon size={18} />, "Notas Fiscais", [
            { href: "/emissao-nfe", text: "Emissão de NF-e" },
            { href: "/emissao-nfse", text: "Emissão de NFS-e" },
            { href: "/recepcao-nfe", text: "Recepção de NF-e" },
            { href: "/recepcao-nfse", text: "Recepção de NFS-e" },
            { href: "/emissao-cte", text: "Emissão de CT-e" },
          ])}

          {renderCollapsibleItem("engenharia", <HardHat size={18} />, "Engenharia", [
            { href: "/custos-unitarios", text: "Custos Unitários" },
            { href: "/orcamento", text: "Orçamento" },
          ])}

          {desktopOpen && <div className="my-3 h-px bg-gray-300" />}
          {desktopOpen && <div className="text-[11px] px-3 font-bold tracking-[0.8px] text-gray-500 uppercase">Outros Módulos</div>}

          {renderCollapsibleItem("suporteoperacional", <FilePlus size={18} />, "Suporte Operacional", [
            { href: "/credor", text: "Credores" },
            { href: "/cliente", text: "Clientes" },
            { href: "/centrocusto", text: "Centro de Custos" },
            { href: "/contacorrente", text: "Contas Correntes" },
            { href: "/empresa", text: "Empresas" },
          ])}
        </nav>

        <div className="px-3 py-4 mt-auto flex flex-col gap-1 border-t border-gray-200">
          {renderNavItem("/suporte", <CircleHelp size={18} />, "Suporte", pathname === "/suporte")}
          {renderNavItem("/configuracoes", <Settings size={18} />, "Configurações", pathname === "/configuracoes")}
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="relative h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm">
          <div className="flex items-center gap-2 z-10">
            <button onClick={() => setMobileOpen(true)} className="p-2 text-gray-800 md:hidden">
              <Menu size={24} />
            </button>
          </div>

          <div ref={searchRef} className="hidden md:block absolute left-1/2 -translate-x-1/2 w-full max-w-xl px-4">
            <div className="relative">
              <div className="flex items-center w-full bg-gray-100 rounded-lg px-3 py-1.5 border border-transparent focus-within:border-blue-200">
                <Search className="ui-text-label" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setSearchOpen(false);
                    }
                    if (e.key === "Enter" && filteredFeatures.length > 0) {
                      navigateToFeature(filteredFeatures[0].href);
                    }
                  }}
                  placeholder="Buscar funcionalidades..."
                  className="bg-transparent outline-none ml-2 w-full text-sm ui-text-primary ui-placeholder"
                />
              </div>

              {searchOpen && (
                <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-30 max-h-80 overflow-y-auto">
                  {filteredFeatures.length === 0 ? (
                    <div className="px-3 py-2 text-sm ui-text-muted">Nenhuma funcionalidade encontrada.</div>
                  ) : (
                    filteredFeatures.map((item) => (
                      <button
                        key={item.href}
                        onClick={() => navigateToFeature(item.href)}
                        className="w-full text-left px-3 py-2 text-sm ui-text-label hover:bg-gray-100 transition-colors"
                      >
                        {item.label}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="ml-auto mr-3 md:mr-5 flex items-center gap-2 z-10">
            <button
              type="button"
              className="hidden md:flex w-9 h-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Marketplace"
            >
              <Store size={18} />
            </button>
            <button
              type="button"
              className="hidden md:flex w-9 h-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Notificações"
            >
              <Bell size={18} />
            </button>
            <div className="max-w-[360px] truncate text-right text-sm font-semibold text-gray-800">
              {companyName}
            </div>
          </div>
        </header>

        <main className="p-6 overflow-y-auto bg-gray-50 flex-1">{children}</main>
      </div>
    </div>
  );
}

function SubTree({
  parentKey,
  subitem,
  relatorioOpen,
  isRouteActive,
  toggleRelatorio,
  renderOptionalLink,
}: {
  parentKey: string;
  subitem: TreeItem;
  relatorioOpen: Record<string, boolean>;
  isRouteActive: (href: string) => boolean;
  toggleRelatorio: (key: string, defaultOpen?: boolean) => void;
  renderOptionalLink: (href: string, text: string, isActive: boolean) => React.ReactNode;
}) {
  if (!subitem.children) {
    return null;
  }

  const childKey = `${parentKey}-${subitem.text}`;
  const isChildActive = subitem.children.some((child) => isRouteActive(child.href));
  const isChildOpen = relatorioOpen[childKey] ?? isChildActive;

  return (
    <div>
      <button
        onClick={() => toggleRelatorio(childKey, isChildActive)}
        className={`flex items-center justify-between w-full py-1 px-3 rounded-md transition-colors text-xs ${
          isChildActive ? "bg-blue-50 text-blue-900" : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <span>{subitem.text}</span>
        {isChildOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>

      {isChildOpen && (
        <div className="pl-4 flex flex-col space-y-1">
          {subitem.children.map((child, childIndex) => (
            <div key={childIndex}>{renderOptionalLink(child.href, child.text, isRouteActive(child.href))}</div>
          ))}
        </div>
      )}
    </div>
  );
}

