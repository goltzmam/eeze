import Link from "next/link";
export default function NotFound() {
  return (
    <main className="legal-page">
      <span className="auth-brand">eaze</span>
      <h1>Este caminho não foi encontrado.</h1>
      <Link className="button" href="/hoje">
        Voltar para Hoje
      </Link>
    </main>
  );
}
