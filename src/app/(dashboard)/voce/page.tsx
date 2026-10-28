import Link from "next/link";
import {
  Watch,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  BookOpen,
  Heart,
  Download,
} from "lucide-react";
import { workspace } from "@/lib/data";
import { PageHeading, SetupNotice } from "@/components/common";
import { Logout } from "@/components/interactive";
import { InstallButton } from "@/components/pwa";
export default async function You() {
  const d = await workspace();
  return (
    <>
      <PageHeading
        eyebrow="VOCÊ"
        title="Seu espaço. Suas escolhas."
        description="Cuide da sua conexão, das suas preferências e da sua privacidade."
      />
      <SetupNotice
        configured={d.configured}
        authenticated={!!d.user}
        error={d.error}
      />
      <div className="profile-card panel">
        <div className="profile-avatar">
          <Heart size={30} strokeWidth={1} />
        </div>
        <div>
          <h2>{d.user ? "Sua jornada com a eaze" : "Vamos nos conhecer?"}</h2>
          <p className="muted">
            {d.user?.email ||
              "Crie sua conta para guardar sua história com segurança."}
          </p>
        </div>
        {!d.user && (
          <Link href="/entrar" className="button">
            Entrar
            <ArrowUpRight size={16} />
          </Link>
        )}
      </div>
      <div className="settings-list">
        {[
          {
            href: "/voce/minha-eaze",
            title: "Minha eaze",
            description: "Conexão, compatibilidade e sincronização.",
            icon: Watch,
          },
          {
            href: "/voce/privacidade",
            title: "Privacidade e dados",
            description: "Consentimentos, exportação e exclusão.",
            icon: ShieldCheck,
          },
          {
            href: "/moments",
            title: "Meus momentos",
            description: "O contexto da sua rotina.",
            icon: BookOpen,
          },
          {
            href: "/insights",
            title: "Meus insights",
            description: "Sua evolução em perspectiva.",
            icon: Sparkles,
          },
        ].map(({ href, title, description, icon: Icon }) => (
          <Link href={href} className="setting-link" key={href}>
            <div className="setting-icon">
              <Icon size={23} strokeWidth={1.3} />
            </div>
            <div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
            <ArrowUpRight size={20} />
          </Link>
        ))}
      </div>
      <div className="panel install-card">
        <Download size={24} />
        <div>
          <h3>A eaze, mais perto de você.</h3>
          <p className="muted">
            Instale pela opção “Adicionar à Tela de Início” do navegador. No
            iPhone, use Compartilhar no Safari.
          </p>
        </div>
        <InstallButton />
      </div>
      {d.user && <Logout />}
      <div className="legal-links">
        <Link href="/privacidade">Privacidade</Link>
        <Link href="/termos">Termos de uso</Link>
        <span>Versão 0.1.0</span>
      </div>
    </>
  );
}
