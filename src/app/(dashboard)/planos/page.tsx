import { workspace } from "@/lib/data";
import { PageHeading, SetupNotice, Empty } from "@/components/common";
import { PlanBuilder, TaskToggle } from "@/components/interactive";
export default async function Plans() {
  const d = await workspace();
  return (
    <>
      <PageHeading
        eyebrow="eaze PLANS"
        title="Evolua no seu ritmo."
        description="Pequenos hábitos. Mais espaço para o que importa."
      />
      <SetupNotice
        configured={d.configured}
        authenticated={!!d.user}
        error={d.error}
      />
      <div className="two-columns align-start">
        <PlanBuilder enabled={!!d.user} />
        <section className="panel">
          <h2>Seu caminho até aqui.</h2>
          {!d.plans.length ? (
            <Empty
              title="Seu próximo passo começa com uma escolha."
              description="Defina um objetivo e crie uma rotina que combine com você."
              icon="plan"
            />
          ) : (
            d.plans.map((p) => {
              const tasks = d.tasks.filter((t) => t.plan_id === p.id);
              const done = tasks.filter((t) => t.completed_at).length;
              return (
                <article key={p.id} className="plan-detail">
                  <h3>{p.title}</h3>
                  <p className="muted">
                    {done} de {tasks.length} passos concluídos
                  </p>
                  <progress
                    value={done}
                    max={tasks.length || 1}
                    aria-label="Progresso do plano"
                  />
                  {tasks.map((t) => (
                    <TaskToggle
                      key={t.id}
                      id={t.id}
                      title={t.title}
                      done={!!t.completed_at}
                      date={t.scheduled_for}
                    />
                  ))}
                </article>
              );
            })
          )}
        </section>
      </div>
    </>
  );
}
