import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  Watch,
  Sun,
  MoveUpRight,
  ShieldCheck,
  Plus,
} from "lucide-react";
import { workspace } from "@/lib/data";
import { weeklySummary } from "@/features/analytics/engine";
import {
  PageHeading,
  SectionTitle,
  BandArt,
  SetupNotice,
} from "@/components/common";
import { MetricGrid } from "@/components/metric-grid";
export default async function Today() {
  const data = await workspace();
  const summaries = weeklySummary(data.measurements);
  const hasData = summaries.some((s) => s.count > 0);
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      hourCycle: "h23",
      timeZone: "America/Sao_Paulo",
    }).format(new Date()),
  );
  const greeting =
    hour < 12 ? "Bom dia." : hour < 18 ? "Boa tarde." : "Boa noite.";
  return (
    <>
      <PageHeading
        eyebrow="SEU DIA, EM PERSPECTIVA"
        title={greeting}
        description="Veja como está sua rotina hoje."
        action={
          <Link href="/voce/minha-eaze" className="connection-chip">
            <span className="hollow-dot" />
            Sem sincronização confirmada
            <ArrowUpRight size={14} />
          </Link>
        }
      />
      <SetupNotice
        configured={data.configured}
        authenticated={!!data.user}
        error={data.error}
      />
      <section className="hero">
        <div className="hero-copy">
          <span className="pill">
            <span className="mini-spark">✳</span> MAIS CLAREZA SOBRE VOCÊ
          </span>
          <h2>
            {hasData ? (
              <>
                Seu dia,
                <br />
                <span>em perspectiva.</span>
              </>
            ) : (
              <>
                Estamos conhecendo
                <br />
                <span>sua rotina.</span>
              </>
            )}
          </h2>
          <p>
            {hasData
              ? "Seus registros começam a contar uma história. Observe suas tendências, respeitando seu próprio ritmo."
              : "Conecte sua pulseira e acompanhe seus primeiros registros para começar a receber análises personalizadas."}
          </p>
          <Link
            href={hasData ? "/saude" : "/voce/minha-eaze"}
            className="button"
          >
            {hasData ? "Explorar meus indicadores" : "Conectar minha eaze"}
            <ArrowUpRight size={17} />
          </Link>
          <div className="hero-footnote">
            <ShieldCheck size={14} /> Seus dados. Suas escolhas.
          </div>
        </div>
        <BandArt />
      </section>
      <section className="section">
        <SectionTitle
          title="Seu ritmo, com mais clareza"
          href="/saude"
          label="Ver saúde"
        />
        {hasData ? (
          <MetricGrid summaries={summaries} />
        ) : (
          <div className="no-metrics">
            <div className="quiet-icon">
              <ActivityMark />
            </div>
            <div>
              <h3>Seus indicadores começam com uma conexão.</h3>
              <p>
                Sono, coração e movimento — apenas os dados que sua pulseira
                realmente disponibilizar.
              </p>
            </div>
            <Link href="/voce/minha-eaze" aria-label="Conectar pulseira">
              <ArrowUpRight size={23} />
            </Link>
          </div>
        )}
      </section>
      <div className="two-columns">
        <section className="panel insight-panel">
          <SectionTitle
            title="O que mudou?"
            href="/insights"
            label="Insights"
          />
          <div className="insight-symbol">
            <Sun size={25} strokeWidth={1.3} />
          </div>
          <h3>Observe. Entenda. Evolua.</h3>
          <p className="muted">
            {hasData
              ? "Consulte as comparações disponíveis no seu relatório. Cada observação respeita o período e a qualidade dos registros."
              : "Com um pouco de histórico, seus padrões ficam mais claros. Por enquanto, cada novo registro é um começo."}
          </p>
          <Link className="text-link" href="/insights">
            Conhecer meus insights <ArrowRight size={15} />
          </Link>
        </section>
        <section className="panel plan-panel">
          <SectionTitle
            title="Pequenos passos. Mais constância."
            href="/planos"
            label="Planos"
          />
          <div className="insight-symbol">
            <MoveUpRight size={25} strokeWidth={1.3} />
          </div>
          <h3>{data.plans[0]?.title || "Uma intenção para o seu dia."}</h3>
          <p className="muted">
            {data.plans.length
              ? "Seu plano está ativo. Continue acompanhando suas tarefas, um dia de cada vez."
              : "Escolha um objetivo e construa uma rotina que faça sentido para você. No seu tempo."}
          </p>
          <Link className="text-link" href="/planos">
            {data.plans.length
              ? "Acompanhar meu plano"
              : "Criar meu primeiro plano"}
            <Plus size={16} />
          </Link>
        </section>
      </div>
      <Link href="/moments" className="moment-banner">
        <div className="moment-icon">
          <Plus size={20} />
        </div>
        <div>
          <h3>Como você está se sentindo?</h3>
          <p>Seu dia é mais do que números. Guarde um momento.</p>
        </div>
        <ArrowUpRight size={20} />
      </Link>
      <div className="closing-note">
        Menos tela. <span>Mais vida.</span>
      </div>
    </>
  );
}
function ActivityMark() {
  return <Watch size={26} strokeWidth={1.2} />;
}
