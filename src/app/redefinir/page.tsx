import Link from "next/link";
import { configured } from "@/lib/supabase/server";
import { AuthForm } from "@/components/interactive";
export const dynamic = "force-dynamic";
export default function Page() {
  return (
    <main className="auth-page">
      <Link className="auth-brand" href="/hoje">
        eaze
      </Link>
      <div className="auth-layout">
        <div className="auth-editorial">
          <p className="eyebrow">eaze INTELLIGENCE</p>
          <h1>
            Menos tela.
            <br />
            <span>Mais vida.</span>
          </h1>
          <p>
            Tecnologia discreta.
            <br />
            Mais espaço para ser você.
          </p>
          <div className="auth-orbit" aria-hidden="true" />
        </div>
        <div className="auth-form panel">
          <p className="eyebrow">SEU ESPAÇO DE BEM-ESTAR</p>
          <h2>Uma nova senha.</h2>
          <p className="muted">
            Escolha uma senha única com pelo menos 12 caracteres.
          </p>
          <AuthForm mode="password" configured={configured()} />
          <div className="auth-links">
            <Link href="/entrar">Já tenho uma conta</Link>
            <Link href="/recuperar">Esqueci minha senha</Link>
          </div>
          <p className="small muted">
            Seus dados de saúde são sensíveis. Você decide o que autorizar em
            Privacidade.
          </p>
        </div>
      </div>
    </main>
  );
}
