"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Activity,
  Sparkles,
  Layers,
  UserRound,
  ArrowUpRight,
} from "lucide-react";
const links = [
  { href: "/hoje", label: "Hoje", icon: House },
  { href: "/saude", label: "Saúde", icon: Activity },
  { href: "/ai", label: "eaze AI", icon: Sparkles },
  { href: "/planos", label: "Planos", icon: Layers },
  { href: "/voce", label: "Você", icon: UserRound },
];
export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Pular para conteúdo
      </a>
      <aside className="sidebar">
        <Link href="/hoje" className="wordmark" aria-label="eaze início">
          eaze<span>Intelligence</span>
        </Link>
        <nav aria-label="Navegação principal">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={
                path === href || path.startsWith(href + "/")
                  ? "nav-link active"
                  : "nav-link"
              }
              aria-current={path === href ? "page" : undefined}
            >
              <Icon size={20} />
              <span>{label}</span>
              {href === "/ai" && <span className="tiny-badge">AI</span>}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <p>
            Menos tela.
            <br />
            <strong>Mais vida.</strong>
          </p>
          <Link href="/voce/minha-eaze" className="sidebar-device">
            Sua eaze, por perto <ArrowUpRight size={16} />
          </Link>
          <span>Bem-estar, no seu ritmo.</span>
        </div>
      </aside>
      <div className="main-column">
        <header className="topbar">
          <Link href="/hoje" className="mobile-wordmark">
            eaze
          </Link>
          <span className="desktop-top-label">UM POUCO MAIS SOBRE VOCÊ</span>
          <div className="topbar-right">
            <span className="status-dot" /> <span>Seu espaço de bem-estar</span>
            <Link href="/voce" className="avatar" aria-label="Minha conta">
              <UserRound size={18} />
            </Link>
          </div>
        </header>
        <main id="main">{children}</main>
        <footer className="footer">
          <span>eaze Intelligence</span>
          <span>Mais clareza sobre você.</span>
        </footer>
      </div>
      <nav className="bottom-nav" aria-label="Navegação mobile">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={path === href ? "page" : undefined}
            className={
              path === href || path.startsWith(href + "/") ? "active" : ""
            }
          >
            <Icon size={21} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
