import Link from "next/link";
import { workspace } from "@/lib/data";
import { weeklySummary } from "@/features/analytics/engine";
import { PageHeading, Empty, SetupNotice } from "@/components/common";
import { MetricGrid } from "@/components/metric-grid";
export default async function Health({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period } = await searchParams;
  const days = period === "30" ? 30 : 7;
  const data = await workspace();
  const summaries = weeklySummary(data.measurements, new Date(), days);
  return (
    <>
      <PageHeading
        eyebrow="SAÚDE"
        title="Entenda seu ritmo."
        description="Seus indicadores, com contexto e sem ruído."
        action={
          <div className="segmented">
            <Link
              href="/saude?period=7"
              aria-current={days === 7 ? "page" : undefined}
            >
              7 dias
            </Link>
            <Link
              href="/saude?period=30"
              aria-current={days === 30 ? "page" : undefined}
            >
              30 dias
            </Link>
          </div>
        }
      />
      <SetupNotice
        configured={data.configured}
        authenticated={!!data.user}
        error={data.error}
      />
      {summaries.some((s) => s.count > 0) ? (
        <MetricGrid summaries={summaries} detail />
      ) : (
        <div className="panel">
          <Empty
            title="Estamos conhecendo seu ritmo."
            description="Continue utilizando sua pulseira para construir um histórico e receber análises mais personalizadas."
            href="/voce/minha-eaze"
            label="Conectar minha eaze"
          />
        </div>
      )}
      <div className="editorial-note">
        <span>01 / SOBRE SEUS INDICADORES</span>
        <h2>
          Informação para se conhecer.
          <br />
          Liberdade para viver.
        </h2>
        <p>
          Apenas métricas comprovadamente disponíveis aparecem aqui. Registros
          ausentes não são estimados. Este aplicativo é voltado ao bem-estar e
          não substitui acompanhamento médico.
        </p>
      </div>
    </>
  );
}
