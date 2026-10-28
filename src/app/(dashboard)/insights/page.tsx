import Link from "next/link";
import { workspace } from "@/lib/data";
import {
  weeklySummary,
  metrics,
  formatValue,
} from "@/features/analytics/engine";
import { PageHeading, Empty, SetupNotice } from "@/components/common";
import { MetricGrid } from "@/components/metric-grid";
import { ShareReport } from "@/components/interactive";
export default async function Insights({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const days = (await searchParams).period === "30" ? 30 : 7;
  const d = await workspace();
  const summaries = weeklySummary(d.measurements, new Date(), days);
  const available = summaries.filter((s) => s.mean !== null);
  return (
    <>
      <PageHeading
        eyebrow="eaze INSIGHTS"
        title={
          days === 7 ? "Sua semana com a eaze." : "Seu mês, em perspectiva."
        }
        description="Uma pausa para observar o caminho que você está construindo."
        action={
          <div className="segmented">
            <Link
              href="/insights"
              aria-current={days === 7 ? "page" : undefined}
            >
              Semana
            </Link>
            <Link
              href="/insights?period=30"
              aria-current={days === 30 ? "page" : undefined}
            >
              Mês
            </Link>
          </div>
        }
      />
      <SetupNotice
        configured={d.configured}
        authenticated={!!d.user}
        error={d.error}
      />
      {available.length ? (
        <>
          <MetricGrid summaries={available} detail />
          <section className="panel">
            <h2>O que observamos</h2>
            {available.slice(0, 3).map((s) => (
              <p key={s.metric}>
                {metrics[s.metric].label}: média de{" "}
                {formatValue(s.mean!, s.metric)} em {s.days} dias observados.{" "}
                {s.change === null
                  ? "Ainda não há histórico anterior suficiente para comparação."
                  : "A comparação com o período anterior está disponível no indicador."}
              </p>
            ))}
            <p className="muted">
              Mudanças são observações, não causas ou diagnósticos.
            </p>
          </section>
        </>
      ) : (
        <div className="report-empty">
          <p className="eyebrow">CADA REGISTRO CONTA</p>
          <Empty
            title="Sua história está começando."
            description="Precisamos de pelo menos três dias com registros válidos em uma categoria para calcular médias. Comparações exigem dados nos dois períodos."
            href="/voce/minha-eaze"
            label="Minha eaze"
          />
        </div>
      )}
      <section className="panel report-share">
        <div>
          <h2>Compartilhe sua intenção.</h2>
          <p className="muted">
            Um card sobre sua jornada. Seus dados de saúde permanecem privados.
          </p>
        </div>
        <ShareReport />
      </section>
    </>
  );
}
