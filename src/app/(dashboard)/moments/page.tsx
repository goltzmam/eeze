import { workspace } from "@/lib/data";
import { PageHeading, SetupNotice, Empty } from "@/components/common";
import { MomentForm } from "@/components/interactive";
export default async function Moments() {
  const d = await workspace();
  return (
    <>
      <PageHeading
        eyebrow="eaze MOMENTS"
        title="Seu dia, além dos números."
        description="Guarde os detalhes que fazem parte da sua rotina."
      />
      <SetupNotice
        configured={d.configured}
        authenticated={!!d.user}
        error={d.error}
      />
      <div className="two-columns align-start">
        <MomentForm enabled={!!d.user} />
        <div className="panel">
          <h2>Seus últimos momentos.</h2>
          {d.moments.length ? (
            d.moments.map((m) => (
              <article key={m.id} className="moment-entry">
                <p className="eyebrow">
                  {new Date(m.recorded_at).toLocaleString("pt-BR", {
                    timeZone: "America/Sao_Paulo",
                  })}
                </p>
                <h3>
                  {
                    (
                      {
                        checkin: "Check-in",
                        movement: "Atividade física",
                        caffeine: "Cafeína",
                        busy: "Dia intenso",
                        travel: "Viagem",
                        walk: "Caminhada",
                        rest: "Descanso",
                        sleep: "Sono fora do horário",
                      } as Record<string, string>
                    )[m.kind]
                  }
                </h3>
                <p>{m.notes}</p>
                <small className="muted">
                  Bem-estar {m.mood}/5 · Energia {m.energy}/5
                </small>
              </article>
            ))
          ) : (
            <Empty
              title="Um espaço para os seus momentos."
              description="Suas anotações aparecerão aqui. Registros pessoais não são medições da pulseira."
            />
          )}
        </div>
      </div>
    </>
  );
}
