import Link from "next/link";
import { Button } from "./ui/button";
import {
  ArrowUpRight,
  ArrowRight,
  Watch,
  ShieldCheck,
  Plus,
} from "lucide-react";
export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="subheading">{description}</p>
      </div>
      {action}
    </div>
  );
}
export function Empty({
  title,
  description,
  href,
  label,
  icon = "watch",
}: {
  title: string;
  description: string;
  href?: string;
  label?: string;
  icon?: string;
}) {
  return (
    <div className="empty">
      <div className="empty-icon">
        {icon === "privacy" ? (
          <ShieldCheck size={25} />
        ) : icon === "plan" ? (
          <Plus size={25} />
        ) : (
          <Watch size={25} />
        )}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {href && (
        <Button asChild>
          <Link href={href}>
            {label}
            <ArrowRight size={16} />
          </Link>
        </Button>
      )}
    </div>
  );
}
export function SectionTitle({
  title,
  href,
  label,
}: {
  title: string;
  href?: string;
  label?: string;
}) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {href && (
        <Link href={href}>
          {label || "Ver mais"}
          <ArrowUpRight size={15} />
        </Link>
      )}
    </div>
  );
}
export function BandArt() {
  return (
    <div className="band-art" aria-hidden="true">
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="band-shadow" />
      <div className="band-strap">
        <div className="band-face">
          <span>eaze</span>
          <i />
        </div>
      </div>
      <span className="art-label">TECNOLOGIA DISCRETA. VIDA PRESENTE.</span>
    </div>
  );
}
export function SetupNotice({
  configured,
  authenticated,
  error,
}: {
  configured: boolean;
  authenticated: boolean;
  error?: string | null;
}) {
  return (
    <>
      {!configured ? (
        <div className="notice" role="status">
          <ShieldCheck size={18} />
          <span>
            Seu espaço está seguro. O acesso à conta e aos registros ficará
            disponível após a configuração do Supabase.
          </span>
        </div>
      ) : !authenticated ? (
        <div className="notice">
          <ShieldCheck size={18} />
          <span>
            <Link href="/entrar">Entre na sua conta</Link> para salvar seus
            planos e registros com privacidade.
          </span>
        </div>
      ) : null}
      {error && (
        <div className="notice error" role="alert">
          {error}
        </div>
      )}
    </>
  );
}
