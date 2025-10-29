"use client";
{/* Ver DeepSeek */}
import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  Trophy,
  Settings,
  User,
  DollarSign,
  Box,
  Layers,
  LogOut,
  LifeBuoy,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Search,
  CircleDollarSign,
  HardHat,
  FileStackIcon,
  PilcrowLeft,
  AlignJustify,
  ChevronLeft,
} from "lucide-react";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname(); // ✅ captura a rota atual
  const [isAuth, setIsAuth] = useState(false);
  
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [relatorioOpen, setRelatorioOpen] = useState<{ [key: string]: boolean }>({});

  const sidebarRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (!auth) {
      router.replace("/login");
    } else {
      setIsAuth(true);
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setMobileOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [router]);

  const toggleRelatorio = (key: string) => {
    setRelatorioOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!isAuth) return null;

  const renderNavItem = (href: string, icon: React.ReactNode, text: string, isActive?: boolean) => (
    <a 
      href={href} 
      className={`flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-200 ${
        isActive ? "bg-blue-900 text-white hover:bg-blue-900" : ""
      }`}
    >
      {icon}
      {(desktopOpen || mobileOpen) && <span>{text}</span>}
    </a>
  );

  const renderCollapsibleItem = (
    key: string, 
    icon: React.ReactNode, 
    text: string, 
    subitems: { href: string; text: string; children?: { href: string; text: string }[] }[]
  ) => (
    <>
      <button
        onClick={() => toggleRelatorio(key)}
        className="flex items-center justify-between gap-3 px-3 py-2 w-full rounded hover:bg-gray-100"
      >
        <div className="flex items-center gap-3">
          {icon}
          {(desktopOpen || mobileOpen) && <span>{text}</span>}
        </div>
        {(desktopOpen || mobileOpen) && (
          relatorioOpen[key] ? <ChevronDown size={16} /> : <ChevronRight size={16} />
        )}
      </button>
      {(desktopOpen || mobileOpen) && relatorioOpen[key] && (
        <div className="pl-8 flex flex-col space-y-1">
          {subitems.map((subitem, index) => (
            <div key={index}>
              {subitem.children ? (
                <div>
                  <button
                    onClick={() => toggleRelatorio(`${key}-${subitem.text}`)}
                    className="flex items-center justify-between w-full py-1 hover:underline"
                  >
                    <span>{subitem.text}</span>
                    {relatorioOpen[`${key}-${subitem.text}`] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                  {relatorioOpen[`${key}-${subitem.text}`] && (
                    <div className="pl-4 flex flex-col space-y-1">
                      {subitem.children.map((child, childIndex) => (
                        <a 
                          key={childIndex} 
                          href={child.href} 
                          className={`py-1 hover:underline text-sm ${
                            pathname === child.href ? "text-blue-900 font-semibold" : ""
                          }`}
                        >
                          {child.text}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a 
                  href={subitem.href} 
                  className={`py-1 hover:underline ${
                    pathname === subitem.href ? "text-blue-900 font-semibold" : ""
                  }`}
                >
                  {subitem.text}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );

  return (
    <div className="flex h-screen">
      {/* Sidebar Mobile */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-md transform transition-transform duration-300 z-50 md:hidden
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          {/* ✅ Logo Mobile com imagem */}
          <div className="px-6 py-4 text-left">
            <img
              src="/Unio Plataforma.png"
              alt="Unio Plataforma"
              className="h-10 object-contain"
            />
          </div>

          {/* Menu Mobile */}
          <nav className="flex-1 px-2 space-y-2 overflow-y-auto">
            {renderNavItem("/home", <Home size={18} />, "Home", pathname === "/home")}
            {renderNavItem("/novo", <Trophy size={18} />, "Novo", pathname === "/novo")}
            {renderNavItem("/configuracoes", <Settings size={18} />, "Configurações", pathname === "/configuracoes")}

            <div className="border-t border-gray-200 my-2"></div>

            <div className="text-gray-400 text-xs px-3 uppercase">Segurança</div>
            {renderNavItem("/usuarios", <User size={18} />, "Usuários", pathname === "/usuarios")}
            {renderNavItem("/perfil", <Settings size={18} />, "Perfil", pathname === "/perfil")}
            {renderNavItem("/credor", <DollarSign size={18} />, "Credores", pathname === "/credor")}

            <div className="border-t border-gray-200 my-2"></div>

            <div className="text-gray-400 text-xs px-3 uppercase">Relatórios</div>

            {renderCollapsibleItem("engenharia", <Layers size={18} />, "Engenharia", [
              { href: "#", text: "Subitem 1" },
              { href: "#", text: "Subitem 2" }
            ])}

            {renderCollapsibleItem("suprimentos", <Box size={18} />, "Suprimentos", [
              { href: "#", text: "Subitem 1" }
            ])}

            {renderCollapsibleItem("financeiro", <DollarSign size={18} />, "Financeiro", [
              { href: "#", text: "Subitem 1" }
            ])}

            {renderCollapsibleItem("comercial", <Trophy size={18} />, "Comercial", [
              { href: "#", text: "Subitem 1" }
            ])}
          </nav>

          {/* Rodapé Mobile */}
          <div className="px-3 py-4 mt-auto flex flex-col gap-2 border-t border-gray-200">
            {renderNavItem("/suporte", <LifeBuoy size={18} />, "Suporte", pathname === "/suporte")}
            <button
              onClick={() => {
                localStorage.removeItem("auth");
                window.location.href = "/login";
              }}
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 text-red-600"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Sidebar Desktop */}
      <aside
        className={`hidden md:flex flex-col h-full bg-white border-r border-gray-200 shadow-md transition-all duration-300
        ${desktopOpen ? "w-64" : "w-16"}`}
      >
        {/* ✅ Logo Desktop com imagem */}
        <div className={`flex items-center justify-center py-4 ${desktopOpen ? "px-6" : "px-0"}`}>
          {desktopOpen ? (
            <img src="/Unio Plataforma.png" alt="Unio Plataforma" className="h-10 object-contain" />
          ) : (
            <img src="/Unio Plataforma.png" alt="Unio Plataforma" className="h-8 object-contain" />
          )}
        </div>

        <div><br /><br /></div>

        {/* Menu Desktop */}
        <nav className="flex-1 px-2 space-y-2 text-blue-900 overflow-y-auto">
          {renderNavItem("/home", <Home size={18} />, "Home", pathname === "/home")}

          {desktopOpen && <div className="border-t border-gray-200 my-2"></div>}
          {desktopOpen && <div className="text-gray-400 text-xs px-3 uppercase">Módulos</div>}

          {renderCollapsibleItem("financeiro", <CircleDollarSign size={18} />, "Financeiro", [
            { 
              href: "#", 
              text: "Contas a Receber",
              children: [
                { href: "/credor", text: "Credor" },
                { href: "#", text: "Consulta de parcelas" }
              ]
            },
            { 
              href: "#", 
              text: "Contas a Pagar",
              children: [
                { href: "#", text: "Títulos" },
                { href: "#", text: "Consulta de parcelas" }
              ]
            },
            { 
              href: "#", 
              text: "Caixa e Bancos",
              children: [
                { href: "#", text: "Saldos" },
                { href: "#", text: "Movimentações" }
              ]
            }
          ])}

          {renderCollapsibleItem("notasfiscais", <FileStackIcon size={18} />, "Notas Fiscais", [
            { href: "#", text: "Emissão de NF-e" },
            { href: "#", text: "Emissão de NFS-e" },
            { href: "#", text: "Recepção de NF-e" },
            { href: "#", text: "Recepção de NFS-e" },
            { href: "#", text: "Emissão de CT-e" }
          ])}

          {renderCollapsibleItem("engenharia", <HardHat size={18} />, "Engenharia", [
            { href: "#", text: "Custos Unitários" },
            { href: "#", text: "Orçamento" }
          ])}

          {desktopOpen && <div className="border-t border-gray-200 my-2"></div>}
          {desktopOpen && <div className="text-gray-400 text-xs px-3 uppercase">Analytics</div>}

          {renderCollapsibleItem("engenharia", <Settings size={18} />, "Engenharia", [
            { href: "#", text: "Subitem 1" },
            { href: "#", text: "Subitem 2" }
          ])}
        </nav>

        {/* Rodapé Desktop */}
        <div className="px-3 py-4 mt-auto flex flex-col gap-2 border-t border-gray-200">
          {renderNavItem("/suporte", <LifeBuoy size={18} />, "Suporte", pathname === "/suporte")}
          {renderNavItem("/configuracoes", <Settings size={18} />, "Configurações", pathname === "/configuracoes")}
        </div>
      </aside>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm">
          {/* Hamburger mobile */}
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 text-gray-800 md:hidden"
          >
            <Menu size={24} />
          </button>

          {/* Toggle sidebar desktop */}
          <button
            onClick={() => setDesktopOpen(!desktopOpen)}
            className="hidden md:flex p-2 text-gray-800 hover:bg-gray-100 rounded"
          >
            {desktopOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>

          {/* Barra de pesquisa */}
          <div className="flex items-center w-full max-w-md bg-gray-100 rounded-lg px-3 py-1 ml-2">
            <Search className="text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Pesquisar..."
              className="bg-transparent outline-none ml-2 w-full text-sm"
            />
          </div>

          {/* Perfil */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                A
              </div>
              <span className="hidden md:inline text-sm font-medium">Admin</span>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md py-1">
                <a href="/perfil" className="block px-4 py-2 hover:bg-gray-100">
                  Meu Perfil
                </a>
                <button
                  onClick={() => {
                    localStorage.removeItem("auth");
                    router.push("/login");
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-blue"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Conteúdo */}
        <main className="p-6 overflow-y-auto bg-gray-50 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
