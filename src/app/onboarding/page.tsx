import Link from "next/link";
const steps = [
  [
    "01",
    "Conheça melhor sua rotina.",
    "A eaze transforma seus dados em informações mais claras sobre você.",
  ],
  [
    "02",
    "Entenda seus padrões.",
    "Acompanhe tendências de sono, atividade e outros indicadores disponíveis.",
  ],
  [
    "03",
    "Evolua no seu ritmo.",
    "Crie planos de hábitos e acompanhe seu progresso.",
  ],
  [
    "04",
    "Seus dados. Suas escolhas.",
    "Você controla quais informações deseja compartilhar e utilizar nas análises.",
  ],
];
export default function Onboarding() {
  return (
    <main className="onboarding">
      <Link href="/hoje" className="auth-brand">
        eaze
      </Link>
      <p className="eyebrow">MAIS CLAREZA SOBRE VOCÊ</p>
      <h1>
        Conhecer-se.
        <br />
        Um dia de cada vez.
      </h1>
      <div className="onboarding-grid">
        {steps.map(([n, title, text]) => (
          <section className="panel" key={n}>
            <span className="eyebrow">{n}</span>
            <h2>{title}</h2>
            <p className="muted">{text}</p>
          </section>
        ))}
      </div>
      <section className="onboarding-end">
        <h2>Vamos começar?</h2>
        <Link href="/criar-conta" className="button">
          Criar minha conta
        </Link>
        <Link href="/entrar" className="text-link">
          Já tenho uma conta
        </Link>
      </section>
    </main>
  );
}
